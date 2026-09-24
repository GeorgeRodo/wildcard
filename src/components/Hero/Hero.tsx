import { ShuffleButton } from '../ShuffleButton'
import styles from './Hero.module.css'

interface HeroProps {
  onShuffle: () => void
  /** Steps out of the way while a photo on the wall is open. */
  faded?: boolean
}

export function Hero({ onShuffle, faded = false }: HeroProps) {
  return (
    <div className={styles.hero} data-faded={faded || undefined}>
      <div className={styles.content}>
        <h1 className={styles.title}>Wildcard</h1>
        <ShuffleButton onClick={onShuffle} />
      </div>
    </div>
  )
}
