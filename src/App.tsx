import { useEffect, useState } from 'react'
import { playError, playReveal, playTick } from './audio/sfx'
import { AnimalGrid } from './components/AnimalGrid'
import { Credits } from './components/Credits'
import { Hero } from './components/Hero'
import { Showcase, type ShowcasePhase } from './components/Showcase'
import { Toolbar } from './components/Toolbar'
import { gallery } from './data/gallery'
import { useRandomSpecies } from './hooks/useRandomSpecies'
import { useShuffle } from './hooks/useShuffle'
import { useSoundEnabled } from './hooks/useSoundEnabled'

function App() {
  // The shuffle is the local flicker through the wall; the species comes
  // from our database. The shuffle runs until the request has finished.
  const shuffle = useShuffle(gallery, playTick)
  const species = useRandomSpecies()
  const [soundOn, setSoundOn] = useSoundEnabled()
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [photoOpen, setPhotoOpen] = useState(false)

  const open = shuffle.status !== 'idle'

  const start = () => {
    shuffle.start()
    // Settle when this request finishes, rather than when the status
    // changes: pressing "Spin again" goes from success to success, which
    // is no change at all, and the shuffle would never stop.
    void species.load().finally(shuffle.settle)
  }

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
        paused={open || creditsOpen}
        onExpandedChange={setPhotoOpen}
      />
      <Hero onShuffle={start} faded={photoOpen} />
      <Toolbar
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((on) => !on)}
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
