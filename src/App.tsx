import { AnimalGrid } from './components/AnimalGrid'
import { AnimalShowcase } from './components/AnimalShowcase'
import { ShuffleButton } from './components/ShuffleButton'
import { gallery } from './data/gallery'
import { useShuffle } from './hooks/useShuffle'

function App() {
  const { status, current, start, reset } = useShuffle(gallery)

  return (
    <main>
      <h1 className="visually-hidden">Wildcard</h1>
      <AnimalGrid animals={gallery} paused={status !== 'idle'} />
      <ShuffleButton onClick={start} />
      <AnimalShowcase
        animal={current}
        status={status}
        onShuffleAgain={start}
        onClose={reset}
      />
    </main>
  )
}

export default App
