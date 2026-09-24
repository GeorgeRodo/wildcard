import { useEffect, useState } from 'react'

/**
 * An on/off setting remembered between visits. Storage can be unavailable
 * (private browsing, blocked cookies), in which case the setting falls back
 * to `initial` and simply isn't remembered.
 */
export function useStoredBoolean(key: string, initial: boolean) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored === null ? initial : stored === 'true'
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, String(value))
    } catch {
      // Not remembered this time; the setting still applies for the visit.
    }
  }, [key, value])

  return [value, setValue] as const
}
