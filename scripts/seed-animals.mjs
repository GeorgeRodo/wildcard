/**
 * Fills the Supabase `animals` table from iNaturalist.
 *
 * Their search takes seconds per call, which is too slow to do while
 * someone is waiting, so we harvest once and read from our own table.
 *
 * Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local, and the
 * table from supabase/schema.sql. Run with: npm run seed
 */
import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const INAT = 'https://api.inaturalist.org/v1'
const ICONIC_TAXA =
  'Mammalia,Aves,Reptilia,Amphibia,Actinopterygii,Insecta,Arachnida,Mollusca'
const LICENCES = 'cc0,cc-by,cc-by-nc,cc-by-sa,cc-by-nc-sa'
const OBSERVATION_PAGES = Number(process.env.SEED_PAGES ?? 25)
const PER_PAGE = 200
/** iNaturalist asks for no more than 60 requests a minute. */
const PAUSE_MS = 1100

const env = Object.fromEntries(
  (await readFile('.env.local', 'utf8').catch(() => ''))
    .split('\n')
    .filter((line) => line.includes('=') && !line.trimStart().startsWith('#'))
    .map((line) => {
      const [key, ...rest] = line.split('=')
      return [key.trim(), rest.join('=').trim()]
    }),
)

const url = process.env.SUPABASE_URL ?? env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { persistSession: false } })
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function getJson(path) {
  const response = await fetch(`${INAT}${path}`, {
    headers: { 'User-Agent': 'wildcard-seed/1.0 (github.com/GeorgeRodo/wildcard)' },
  })
  if (!response.ok) throw new Error(`iNaturalist replied with ${response.status}`)
  return response.json()
}

const largePhoto = (url) => url.replace(/\/(square|small|medium)\./, '/large.')

function cleanSummary(html) {
  const text = (html ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/\(\s*help\s*[·.]\s*info\s*\)/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+([;,.])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= 360) return text
  const cut = text.slice(0, 360)
  const lastSentence = cut.lastIndexOf('. ')
  return lastSentence > 120 ? cut.slice(0, lastSentence + 1) : `${cut.trimEnd()}…`
}

// One observation per species, keeping the first (most faved) photo we see.
const species = new Map()

for (let page = 1; page <= OBSERVATION_PAGES; page++) {
  const query = new URLSearchParams({
    quality_grade: 'research',
    rank: 'species',
    photos: 'true',
    popular: 'true',
    photo_license: LICENCES,
    iconic_taxa: ICONIC_TAXA,
    per_page: String(PER_PAGE),
    page: String(page),
  })

  const { results = [] } = await getJson(`/observations?${query}`)
  if (results.length === 0) break

  for (const observation of results) {
    const taxon = observation.taxon
    const photo = observation.photos?.[0]
    if (!taxon?.id || !taxon.name || !photo?.url || species.has(taxon.id)) continue

    species.set(taxon.id, {
      taxon_id: taxon.id,
      name: taxon.preferred_common_name ?? taxon.name,
      scientific_name: taxon.name,
      taxon_group: taxon.iconic_taxon_name ?? 'Animal',
      photo_url: largePhoto(photo.url),
      photo_attribution: photo.attribution ?? 'iNaturalist',
      inaturalist_url: `https://www.inaturalist.org/taxa/${taxon.id}`,
    })
  }

  console.log(`page ${page}/${OBSERVATION_PAGES}: ${species.size} species so far`)
  await wait(PAUSE_MS)
}

// Summaries and conservation status come from the taxa endpoint, which
// takes up to 30 ids at a time.
const ids = [...species.keys()]
for (let i = 0; i < ids.length; i += 30) {
  const batch = ids.slice(i, i + 30)
  const { results = [] } = await getJson(`/taxa/${batch.join(',')}`)

  for (const taxon of results) {
    const row = species.get(taxon.id)
    if (!row) continue
    row.summary = cleanSummary(taxon.wikipedia_summary)
    row.conservation_status = taxon.conservation_status?.status_name ?? null
    row.observation_count = taxon.observations_count ?? null
  }

  console.log(`details ${Math.min(i + 30, ids.length)}/${ids.length}`)
  await wait(PAUSE_MS)
}

// Species with no summary read as an empty card, so leave them out.
const rows = [...species.values()].filter((row) => row.summary)
console.log(`\n${rows.length} of ${species.size} species have a summary; saving those.`)

for (let i = 0; i < rows.length; i += 500) {
  const chunk = rows.slice(i, i + 500)
  const { error } = await supabase.from('animals').upsert(chunk, { onConflict: 'taxon_id' })
  if (error) {
    console.error('Supabase rejected the batch:', error.message)
    process.exit(1)
  }
  console.log(`saved ${Math.min(i + 500, rows.length)}/${rows.length}`)
}

const { count } = await supabase.from('animals').select('*', { count: 'exact', head: true })
console.log(`\nDone. The table now holds ${count} animals.`)
