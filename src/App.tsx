import { BackgroundGrid } from './components/BackgroundGrid'
import { backgrounds } from './data/backgrounds'

function App() {
  return (
    <>
      <BackgroundGrid images={backgrounds} />
      <main />
    </>
  )
}

export default App
