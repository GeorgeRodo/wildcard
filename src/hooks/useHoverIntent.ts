import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Tracks which item the pointer has rested on for at least `delay` ms.
 * Leaving an item resets it straight away, so quickly sweeping the mouse
 * across the page doesn't trigger anything.
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

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { active, enter, leave }
}
