import type { SupabaseClient } from '@supabase/supabase-js'
import { ApiError, type Species } from './inaturalist'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** Without credentials the site falls back to calling iNaturalist directly. */
export const supabaseConfigured = Boolean(url && anonKey)

/**
 * The Supabase library is most of the site's JavaScript, so it is loaded on
 * its own after the page, rather than holding up the first paint. The first
 * animal is prefetched as soon as the page mounts, which is what loads it.
 */
let client: Promise<SupabaseClient> | null = null

function getClient() {
  client ??= import('@supabase/supabase-js')
    .then(({ createClient }) => createClient(url, anonKey, { auth: { persistSession: false } }))
    .catch((cause: unknown) => {
      // A dropped connection shouldn't rule the database out for the whole visit.
      client = null
      throw cause
    })
  return client
}

interface AnimalRow {
  taxon_id: number
  name: string
  scientific_name: string
  taxon_group: string
  summary: string
  conservation_status: string | null
  observation_count: number | null
  photo_url: string
  photo_attribution: string
  inaturalist_url: string
}

const toSpecies = (row: AnimalRow): Species => ({
  taxonId: row.taxon_id,
  name: row.name,
  scientificName: row.scientific_name,
  group: row.taxon_group,
  summary: row.summary,
  conservationStatus: row.conservation_status,
  observationCount: row.observation_count,
  photo: {
    url: row.photo_url,
    attribution: row.photo_attribution,
  },
  place: null,
  inaturalistUrl: row.inaturalist_url,
})

/**
 * Picks a random animal from our own table. This is the fast path: the
 * species were harvested from iNaturalist ahead of time, so reading one
 * takes a few dozen milliseconds instead of several seconds.
 */
export async function fetchRandomAnimal(
  signal: AbortSignal,
  exclude: number[] = [],
): Promise<Species> {
  if (!supabaseConfigured) throw new ApiError('Supabase is not configured.')

  // The function returns a set, but always of one row at most.
  const { data, error } = await (await getClient())
    .rpc('random_animal', { exclude_ids: exclude })
    .abortSignal(signal)
    .maybeSingle<AnimalRow>()

  if (error) throw new ApiError(`The animal database said: ${error.message}`)
  if (!data) throw new ApiError('The animal database is empty.')

  return toSpecies(data)
}
