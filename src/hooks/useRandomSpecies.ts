import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, fetchRandomSpecies, type Species } from '../api/inaturalist'

/** Give up on a request that takes longer than this. */
const TIMEOUT_MS = 10_000
/** How many recent animals to remember, so they don't come round again. */
const RECENT_LIMIT = 10

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

export function useRandomSpecies() {
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [species, setSpecies] = useState<Species | null>(null)
  const [error, setError] = useState<string | null>(null)

  const request = useRef<AbortController | null>(null)
  const recent = useRef<number[]>([])

  const cancel = useCallback(() => {
    request.current?.abort()
    request.current = null
  }, [])

  const load = useCallback(async () => {
    cancel()

    const controller = new AbortController()
    request.current = controller
    const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS)

    setStatus('loading')
    setError(null)

    try {
      const result = await fetchRandomSpecies(controller.signal, recent.current)
      recent.current = [result.taxonId, ...recent.current].slice(0, RECENT_LIMIT)
      setSpecies(result)
      setStatus('success')
    } catch (cause) {
      // A cancelled request is the caller changing its mind, not a failure.
      if (controller.signal.aborted && request.current !== controller) return

      setError(
        cause instanceof ApiError
          ? cause.message
          : controller.signal.aborted
            ? 'iNaturalist took too long to answer.'
            : 'Something went wrong talking to iNaturalist.',
      )
      setStatus('error')
    } finally {
      window.clearTimeout(timeout)
      if (request.current === controller) request.current = null
    }
  }, [cancel])

  const reset = useCallback(() => {
    cancel()
    setStatus('idle')
    setSpecies(null)
    setError(null)
  }, [cancel])

  useEffect(() => cancel, [cancel])

  return { status, species, error, load, reset }
}
