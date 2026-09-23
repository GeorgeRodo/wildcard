import { ShuffleButton } from '../ShuffleButton'
import styles from './Hero.module.css'

interface HeroProps {
  onShuffle: () => void
}

export function Hero({ onShuffle }: HeroProps) {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Wildcard</h1>
      <ShuffleButton onClick={onShuffle} />
    </div>
  )
}
