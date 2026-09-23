import { AnimalGrid } from './components/AnimalGrid'
import { AnimalShowcase } from './components/AnimalShowcase'
import { Hero } from './components/Hero'
import { gallery } from './data/gallery'
import { useShuffle } from './hooks/useShuffle'

function App() {
  const { status, current, start, reset } = useShuffle(gallery)

  return (
    <main>
      <AnimalGrid animals={gallery} paused={status !== 'idle'} />
      <Hero onShuffle={start} />
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
