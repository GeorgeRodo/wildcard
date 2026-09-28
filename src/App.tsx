import { useEffect, useRef, useState } from 'react'
import { playError, playReveal, playTick } from './audio/sfx'
import { AnimalGrid } from './components/AnimalGrid'
import { Credits } from './components/Credits'
import { Hero } from './components/Hero'
import { Showcase, type ShowcasePhase } from './components/Showcase'
import { Toolbar } from './components/Toolbar'
import { gallery } from './data/gallery'
import { useRandomSpecies } from './hooks/useRandomSpecies'
import { useShuffle } from './hooks/useShuffle'
import type { Rect } from './utils/rects'
import { useSoundEnabled } from './hooks/useSoundEnabled'
import { useStoredBoolean } from './hooks/useStoredBoolean'

/** Anything that already does its own thing when Enter is pressed on it. */
const INTERACTIVE = 'a[href], button, input, select, textarea, summary, [contenteditable]'

/** Visitors who ask their system for less motion start with the wall still. */
const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

function App() {
  // The shuffle is the local flicker through the wall; the species comes
  // from our database. The shuffle runs until the request has finished.
  const shuffle = useShuffle(gallery, playTick)
  const species = useRandomSpecies()
  const [soundOn, setSoundOn] = useSoundEnabled()
  const [wallPaused, setWallPaused] = useStoredBoolean('wildcard:wall-paused', prefersReducedMotion())
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [openPhotoArea, setOpenPhotoArea] = useState<Rect | null>(null)

  const open = shuffle.status !== 'idle'

  const start = () => {
    shuffle.start()
    // Settle when this request finishes, rather than when the status
    // changes: pressing "Spin again" goes from success to success, which
    // is no change at all, and the shuffle would never stop.
    void species.load().finally(shuffle.settle)
  }

  // Enter spins from anywhere on the wall, so a keyboard needs no aiming.
  // Kept in a ref so the listener always calls the latest `start`.
  const startRef = useRef(start)
  useEffect(() => {
    startRef.current = start
  })

  const dialogOpen = open || creditsOpen
  useEffect(() => {
    if (dialogOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.repeat) return
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.target instanceof Element && event.target.closest(INTERACTIVE)) return

      event.preventDefault()
      startRef.current()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dialogOpen])

  const close = () => {
    shuffle.reset()
    species.reset()
  }

  const phase: ShowcasePhase =
    shuffle.status === 'shuffling'
      ? 'shuffling'
      : species.status === 'error'
        ? 'error'
        : species.status === 'success'
          ? 'ready'
          : 'loading'

  useEffect(() => {
    if (phase === 'ready') playReveal()
    if (phase === 'error') playError()
  }, [phase])

  return (
    <main>
      <AnimalGrid
        animals={gallery}
        paused={open || creditsOpen || wallPaused}
        onOpenAreaChange={setOpenPhotoArea}
      />
      <Hero onShuffle={start} obstruction={openPhotoArea} />
      <Toolbar
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((on) => !on)}
        wallPaused={wallPaused}
        onToggleWall={() => setWallPaused((paused) => !paused)}
        onOpenCredits={() => setCreditsOpen(true)}
      />
      {open && (
        <Showcase
          phase={phase}
          teaser={shuffle.current}
          species={species.species}
          error={species.error}
          onShuffleAgain={start}
          onRetry={() => void species.load()}
          onClose={close}
        />
      )}
      {creditsOpen && <Credits onClose={() => setCreditsOpen(false)} />}
    </main>
  )
}

export default App
