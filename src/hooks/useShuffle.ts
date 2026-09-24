import { useCallback, useEffect, useRef, useState } from 'react'

/** Gap between the first few swaps. */
const FIRST_STEP_MS = 60
/** The gap stops growing here, and the shuffle ticks over at this speed. */
const SLOWEST_STEP_MS = 320
/** How much longer each gap is than the one before it. */
const SLOWDOWN = 1.18
/** Shuffle for at least this long, even if the answer arrives instantly. */
const MIN_DURATION_MS = 1400

export type ShuffleStatus = 'idle' | 'shuffling' | 'done'

/**
 * Flicks through `items` at random, slowing down as it goes. It keeps
 * ticking over at its slowest speed until `settle` is called, so it can run
 * for exactly as long as whatever it is waiting for. `settle` always leaves
 * it running for a minimum spell, so a quick answer doesn't make the
 * animation look like a glitch.
 *
 * `onStep` runs on every flick, e.g. to play a click in time with it.
 */
export function useShuffle<T>(items: T[], onStep?: () => void) {
  const [status, setStatus] = useState<ShuffleStatus>('idle')
  const [current, setCurrent] = useState<T | null>(null)

  // Kept in a ref so a new callback doesn't restart a running shuffle.
  const stepCallback = useRef(onStep)
  useEffect(() => {
    stepCallback.current = onStep
  }, [onStep])

  const stepTimer = useRef<number | undefined>(undefined)
  const settleTimer = useRef<number | undefined>(undefined)
  const startedAt = useRef(0)

  const clearTimers = useCallback(() => {
    window.clearTimeout(stepTimer.current)
    window.clearTimeout(settleTimer.current)
  }, [])

  const start = useCallback(() => {
    if (items.length === 0) return

    clearTimers()
    startedAt.current = performance.now()
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
      stepCallback.current?.()

      delay = Math.min(delay * SLOWDOWN, SLOWEST_STEP_MS)
      stepTimer.current = window.setTimeout(step, delay)
    }

    step()
  }, [items, clearTimers])

  /** Stops the shuffle, once it has run for its minimum spell. */
  const settle = useCallback(() => {
    window.clearTimeout(settleTimer.current)

    const remaining = MIN_DURATION_MS - (performance.now() - startedAt.current)
    settleTimer.current = window.setTimeout(
      () => {
        window.clearTimeout(stepTimer.current)
        setStatus('done')
      },
      Math.max(0, remaining),
    )
  }, [])

  const reset = useCallback(() => {
    clearTimers()
    setStatus('idle')
    setCurrent(null)
  }, [clearTimers])

  useEffect(() => clearTimers, [clearTimers])

  return { status, current, start, settle, reset }
}
