import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ApiError,
  fetchRandomSighting,
  fetchTaxonDetails,
  type Species,
} from '../api/inaturalist'
import { fetchRandomAnimal, supabaseConfigured } from '../api/supabase'

/** Give up on a request that takes longer than this. Their search is slow,
 *  routinely taking several seconds, so this is deliberately generous. */
const TIMEOUT_MS = 15_000
/** Don't hold a result back longer than this for a slow photo. */
const PHOTO_TIMEOUT_MS = 2_500
/** How many recent animals to remember, so they don't come round again. */
const RECENT_LIMIT = 10

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * Resolves once the photo is in the browser's cache, so the card doesn't
 * appear with an empty frame. It also resolves on failure, on abort, or
 * after `PHOTO_TIMEOUT_MS`: the entry is still worth showing, and the photo
 * can finish arriving in place.
 */
function preloadImage(url: string, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const image = new Image()
    const timeout = window.setTimeout(resolve, PHOTO_TIMEOUT_MS)
    const done = () => {
      window.clearTimeout(timeout)
      resolve()
    }

    image.onload = done
    image.onerror = done
    signal.addEventListener('abort', done, { once: true })
    image.src = url
  })
}

function describe(cause: unknown) {
  if (cause instanceof ApiError) return cause.message
  if (cause instanceof DOMException && cause.name === 'AbortError') {
    return 'iNaturalist took too long to answer.'
  }
  return 'Something went wrong talking to iNaturalist.'
}

/**
 * Supplies a random species.
 *
 * Normally this reads one row from our own Supabase table, which was
 * seeded from iNaturalist and answers in milliseconds. If that fails, or
 * the project has no Supabase credentials, it falls back to asking
 * iNaturalist directly, which works but takes several seconds.
 *
 * Either way one animal is fetched ahead of time and kept ready, so
 * pressing the button hands over the waiting one and starts loading the
 * next in the background.
 */
export function useRandomSpecies() {
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [species, setSpecies] = useState<Species | null>(null)
  const [error, setError] = useState<string | null>(null)

  const recent = useRef<number[]>([])
  const ready = useRef<Species | null>(null)
  const pending = useRef<Promise<Species | null> | null>(null)
  const requests = useRef(new Set<AbortController>())

  /** The slow path: ask iNaturalist for a random sighting right now. */
  const fetchFromInaturalist = useCallback(
    async (signal: AbortSignal): Promise<Species> => {
      const sighting = await fetchRandomSighting(signal, recent.current)

      // The photo and the taxon details are independent, so fetch both at
      // once rather than waiting for one and then the other.
      const [details] = await Promise.all([
        fetchTaxonDetails(sighting.taxonId, signal),
        preloadImage(sighting.photo.url, signal),
      ])

      return { ...sighting, ...details }
    },
    [],
  )

  const fetchOne = useCallback(async (): Promise<Species> => {
    const controller = new AbortController()
    requests.current.add(controller)
    const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
      let species: Species

      if (supabaseConfigured) {
        try {
          species = await fetchRandomAnimal(recent.current)
          await preloadImage(species.photo.url, controller.signal)
        } catch (cause) {
          console.warn('Falling back to iNaturalist:', cause)
          species = await fetchFromInaturalist(controller.signal)
        }
      } else {
        species = await fetchFromInaturalist(controller.signal)
      }

      recent.current = [species.taxonId, ...recent.current].slice(0, RECENT_LIMIT)
      return species
    } finally {
      window.clearTimeout(timeout)
      requests.current.delete(controller)
    }
  }, [fetchFromInaturalist])


  /** Warms up the next animal in the background. */
  const prefetch = useCallback(() => {
    if (ready.current || pending.current) return

    pending.current = fetchOne()
      .then((result) => {
        ready.current = result
        return result
      })
      .catch(() => null)
      .finally(() => {
        pending.current = null
      })
  }, [fetchOne])

  const load = useCallback(async () => {
    setError(null)

    // Usually there is one waiting, and the card can open straight away.
    if (ready.current) {
      setSpecies(ready.current)
      setStatus('success')
      ready.current = null
      prefetch()
      return
    }

    setStatus('loading')

    try {
      const result = (await (pending.current ?? fetchOne())) ?? null
      ready.current = null

      if (!result) throw new ApiError('iNaturalist did not send an animal back.')

      setSpecies(result)
      setStatus('success')
    } catch (cause) {
      setError(describe(cause))
      setStatus('error')
    }

    prefetch()
  }, [fetchOne, prefetch])

  const reset = useCallback(() => {
    setStatus('idle')
    setSpecies(null)
    setError(null)
  }, [])

  // Load the first animal while the visitor is still looking at the wall.
  useEffect(() => {
    prefetch()
  }, [prefetch])

  useEffect(() => {
    const inFlight = requests.current
    return () => {
      for (const controller of inFlight) controller.abort()
    }
  }, [])

  return { status, species, error, load, reset }
}
