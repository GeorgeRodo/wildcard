import { useEffect, useState } from 'react'
import { setMuted } from '../audio/sfx'

const STORAGE_KEY = 'wildcard:sound'

/**
 * Whether sound is on, remembered between visits. Storage can be
 * unavailable (private browsing, blocked cookies), in which case it simply
 * defaults to on and isn't remembered.
 */
export function useSoundEnabled() {
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'off'
    } catch {
      return true
    }
  })

  useEffect(() => {
    setMuted(!enabled)
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
    } catch {
      // Not remembered this time; the setting still applies for the visit.
    }
  }, [enabled])

  return [enabled, setEnabled] as const
}
