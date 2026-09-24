import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Tracks which item is open, for both a mouse and a finger.
 *
 * With a mouse, an item opens once the pointer has rested on it for at
 * least `delay` ms, and closes as soon as the pointer leaves, so sweeping
 * across the page doesn't trigger anything. A finger has no hover, so
 * `toggle` opens an item straight away and a second tap closes it.
 */
export function useHoverIntent<T>(delay: number) {
  const [active, setActive] = useState<T | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const enter = useCallback(
    (item: T) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setActive(item), delay)
    },
    [delay],
  )

  const leave = useCallback(() => {
    window.clearTimeout(timer.current)
    setActive(null)
  }, [])

  const toggle = useCallback((item: T) => {
    window.clearTimeout(timer.current)
    setActive((current) => (current === item ? null : item))
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { active, enter, leave, toggle }
}
