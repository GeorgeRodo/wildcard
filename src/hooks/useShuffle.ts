import { useCallback, useEffect, useRef, useState } from 'react'

/** Gap between the first few swaps. */
const FIRST_STEP_MS = 60
/** Once the gap has grown this long, the shuffle stops. */
const LAST_STEP_MS = 420
/** How much longer each gap is than the one before it. */
const SLOWDOWN = 1.18

export type ShuffleStatus = 'idle' | 'shuffling' | 'done'

/**
 * Flicks through `items` at random, slowing down until it settles on one,
 * the way a slot machine comes to a stop. Takes about two and a half
 * seconds in total.
 */
export function useShuffle<T>(items: T[]) {
  const [status, setStatus] = useState<ShuffleStatus>('idle')
  const [current, setCurrent] = useState<T | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const start = useCallback(() => {
    if (items.length === 0) return

    window.clearTimeout(timer.current)
    setStatus('shuffling')

    let delay = FIRST_STEP_MS
    let previous: T | null = null

    const step = () => {
      let next = items[Math.floor(Math.random() * items.length)]
      // Never show the same one twice in a row: it reads as a stutter.
      while (items.length > 1 && next === previous) {
        next = items[Math.floor(Math.random() * items.length)]
      }
      previous = next
      setCurrent(next)

      if (delay >= LAST_STEP_MS) {
        setStatus('done')
        return
      }

      delay = Math.min(delay * SLOWDOWN, LAST_STEP_MS)
      timer.current = window.setTimeout(step, delay)
    }

    step()
  }, [items])

  const reset = useCallback(() => {
    window.clearTimeout(timer.current)
    setStatus('idle')
    setCurrent(null)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { status, current, start, reset }
}
