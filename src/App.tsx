import { AnimalGrid } from './components/AnimalGrid'
import { gallery } from './data/gallery'

function App() {
  return (
    <main>
      <AnimalGrid animals={gallery} />
    </main>
  )
}

export default App
