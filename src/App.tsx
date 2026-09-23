import { useEffect } from 'react'
import { AnimalGrid } from './components/AnimalGrid'
import { Hero } from './components/Hero'
import { Showcase, type ShowcasePhase } from './components/Showcase'
import { gallery } from './data/gallery'
import { useRandomSpecies } from './hooks/useRandomSpecies'
import { useShuffle } from './hooks/useShuffle'

function App() {
  // The shuffle is the local flicker through the wall; the species comes
  // from iNaturalist. The shuffle runs until the request has finished.
  const shuffle = useShuffle(gallery)
  const species = useRandomSpecies()

  const { settle } = shuffle
  const requestStatus = species.status

  useEffect(() => {
    if (requestStatus === 'success' || requestStatus === 'error') settle()
  }, [requestStatus, settle])

  const open = shuffle.status !== 'idle'

  const start = () => {
    shuffle.start()
    void species.load()
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

  return (
    <main>
      <AnimalGrid animals={gallery} paused={open} />
      <Hero onShuffle={start} />
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
    </main>
  )
}

export default App
