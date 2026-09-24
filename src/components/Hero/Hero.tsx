import { useLayoutEffect, useRef, useState } from 'react'
import { rectsOverlap, type Rect } from '../../utils/rects'
import { ShuffleButton } from '../ShuffleButton'
import styles from './Hero.module.css'

/** Step aside for a photo that comes this close to the title. */
const CLEARANCE = 16

interface HeroProps {
  onShuffle: () => void
  /** The area an open photo covers, if any. */
  obstruction?: Rect | null
}

export function Hero({ onShuffle, obstruction = null }: HeroProps) {
  const content = useRef<HTMLDivElement>(null)
  const [faded, setFaded] = useState(false)

  // Only get out of the way when the photo would actually cover the title;
  // one opened in a corner leaves it where it is. Measured before paint, so
  // the title starts fading as the photo starts growing.
  useLayoutEffect(() => {
    const box = content.current?.getBoundingClientRect()
    setFaded(obstruction !== null && box !== undefined && rectsOverlap(obstruction, box, CLEARANCE))
  }, [obstruction])

  return (
    <div className={styles.hero} data-faded={faded || undefined}>
      <div ref={content} className={styles.content}>
        <h1 className={styles.title}>Wildcard</h1>
        <ShuffleButton onClick={onShuffle} />
      </div>
    </div>
  )
}
