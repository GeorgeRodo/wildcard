/**
 * A thin client for the iNaturalist API.
 *
 * Random species come from the observations endpoint rather than the taxa
 * one, because only observations can be filtered by photo licence, and we
 * can only show photos we are allowed to show. Ordering by votes keeps the
 * results to photos the community has picked out, which are far better
 * than an arbitrary sighting.
 */

const API = 'https://api.inaturalist.org/v1'

/** Animals only: no plants, fungi or unknowns. */
const ICONIC_TAXA = [
  'Mammalia',
  'Aves',
  'Reptilia',
  'Amphibia',
  'Actinopterygii',
  'Insecta',
  'Arachnida',
  'Mollusca',
].join(',')

const LICENCES = 'cc0,cc-by,cc-by-nc,cc-by-sa,cc-by-nc-sa'
const PAGE_SIZE = 20
/** How deep into the most-liked observations to look. */
const MAX_PAGE = 25

export interface Species {
  taxonId: number
  name: string
  scientificName: string
  group: string
  summary: string
  conservationStatus: string | null
  observationCount: number | null
  photo: {
    url: string
    attribution: string
  }
  place: string | null
  inaturalistUrl: string
}

export class ApiError extends Error {}

/** iNaturalist serves several sizes from one URL. */
const largePhoto = (url: string) => url.replace(/\/(square|small|medium)\./, '/large.')

/** Longest summary to show before trimming to the last full sentence. */
const SUMMARY_LIMIT = 360

function cleanSummary(html: string) {
  const text = html
    .replace(/<[^>]+>/g, '')
    // Wikipedia leaves pronunciation asides like "(help·info)" behind.
    .replace(/\(\s*help\s*[·.]\s*info\s*\)/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+([;,.])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= SUMMARY_LIMIT) return text

  const cut = text.slice(0, SUMMARY_LIMIT)
  const lastSentence = cut.lastIndexOf('. ')
  return lastSentence > 120 ? cut.slice(0, lastSentence + 1) : `${cut.trimEnd()}…`
}

/** Taxon details rarely change, so keep them for the session. */
const taxonCache = new Map<number, { summary: string; conservationStatus: string | null; observationCount: number | null }>()

async function getJson(url: string, signal: AbortSignal): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  } catch (cause) {
    if (signal.aborted) throw cause
    throw new ApiError('Could not reach iNaturalist. Check your connection.')
  }

  if (!response.ok) {
    throw new ApiError(`iNaturalist replied with ${response.status}.`)
  }

  return response.json()
}

interface ObservationResponse {
  results?: {
    taxon?: {
      id?: number
      name?: string
      preferred_common_name?: string
      iconic_taxon_name?: string
    }
    photos?: { url?: string; attribution?: string }[]
    place_guess?: string | null
  }[]
}

interface TaxonResponse {
  results?: {
    wikipedia_summary?: string | null
    observations_count?: number
    conservation_status?: { status_name?: string } | null
  }[]
}

async function fetchTaxonDetails(taxonId: number, signal: AbortSignal) {
  const cached = taxonCache.get(taxonId)
  if (cached) return cached

  const data = (await getJson(`${API}/taxa/${taxonId}`, signal)) as TaxonResponse
  const taxon = data.results?.[0]

  const details = {
    summary: taxon?.wikipedia_summary ? cleanSummary(taxon.wikipedia_summary) : '',
    conservationStatus: taxon?.conservation_status?.status_name ?? null,
    observationCount: taxon?.observations_count ?? null,
  }

  taxonCache.set(taxonId, details)
  return details
}

/**
 * Picks one random animal from the most-liked observations on iNaturalist.
 * `exclude` holds recently shown taxon ids, so the same animal doesn't come
 * up twice in a row.
 */
export async function fetchRandomSpecies(
  signal: AbortSignal,
  exclude: number[] = [],
): Promise<Species> {
  const params = new URLSearchParams({
    quality_grade: 'research',
    rank: 'species',
    photos: 'true',
    photo_license: LICENCES,
    iconic_taxa: ICONIC_TAXA,
    order_by: 'votes',
    per_page: String(PAGE_SIZE),
    page: String(1 + Math.floor(Math.random() * MAX_PAGE)),
  })

  const data = (await getJson(`${API}/observations?${params}`, signal)) as ObservationResponse
  const usable = (data.results ?? []).filter(
    (result) =>
      result.taxon?.id !== undefined &&
      result.taxon.name &&
      result.photos?.[0]?.url &&
      !exclude.includes(result.taxon.id),
  )

  if (usable.length === 0) {
    throw new ApiError('iNaturalist returned nothing usable. Try again.')
  }

  const observation = usable[Math.floor(Math.random() * usable.length)]
  const taxon = observation.taxon!
  const photo = observation.photos![0]
  const details = await fetchTaxonDetails(taxon.id!, signal)

  return {
    taxonId: taxon.id!,
    name: taxon.preferred_common_name ?? taxon.name!,
    scientificName: taxon.name!,
    group: taxon.iconic_taxon_name ?? 'Animal',
    summary: details.summary,
    conservationStatus: details.conservationStatus,
    observationCount: details.observationCount,
    photo: {
      url: largePhoto(photo.url!),
      attribution: photo.attribution ?? 'iNaturalist',
    },
    place: observation.place_guess ?? null,
    inaturalistUrl: `https://www.inaturalist.org/taxa/${taxon.id}`,
  }
}
