import { useEffect } from 'react'
import { setMuted } from '../audio/sfx'
import { useStoredBoolean } from './useStoredBoolean'

/** Whether sound is on, remembered between visits. On by default. */
export function useSoundEnabled() {
  const [enabled, setEnabled] = useStoredBoolean('wildcard:sound-enabled', true)

  useEffect(() => {
    setMuted(!enabled)
  }, [enabled])

  return [enabled, setEnabled] as const
}
