import { createClient } from '@supabase/supabase-js'
import { ApiError, type Species } from './inaturalist'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** Without credentials the site falls back to calling iNaturalist directly. */
export const supabaseConfigured = Boolean(url && anonKey)

const client = supabaseConfigured
  ? createClient(url, anonKey, { auth: { persistSession: false } })
  : null

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
export async function fetchRandomAnimal(exclude: number[] = []): Promise<Species> {
  if (!client) throw new ApiError('Supabase is not configured.')

  // The function returns a set, but always of one row at most.
  const { data, error } = await client
    .rpc('random_animal', { exclude_ids: exclude })
    .maybeSingle<AnimalRow>()

  if (error) throw new ApiError(`The animal database said: ${error.message}`)
  if (!data) throw new ApiError('The animal database is empty.')

  return toSpecies(data)
}
