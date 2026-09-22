import { AnimalGrid } from './components/AnimalGrid'
import { gallery } from './data/gallery'

function App() {
  return (
    <main>
      <h1 className="visually-hidden">Gambling Nature</h1>
      <AnimalGrid animals={gallery} />
    </main>
  )
}

export default App
