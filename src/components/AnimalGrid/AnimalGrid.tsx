import type { GalleryItem } from '../../data/gallery'
import { useHoverIntent } from '../../hooks/useHoverIntent'
import { useMarquee } from '../../hooks/useMarquee'
import { chunk } from '../../utils/chunk'
import { AnimalTile } from '../AnimalTile'
import styles from './AnimalGrid.module.css'

/** Rows on screen. The number of columns follows from how many animals there are. */
const ROWS = 4

/** How long the pointer has to rest on a photo before it expands. */
const HOVER_DELAY_MS = 400

/** How fast the wall drifts left, in pixels per second. */
const SCROLL_SPEED = 20

interface AnimalGridProps {
  animals: GalleryItem[]
}

export function AnimalGrid({ animals }: AnimalGridProps) {
  const columns = chunk(animals, ROWS)
  const { active: expandedKey, enter, leave } = useHoverIntent<string>(HOVER_DELAY_MS)
  // Two copies of the columns, so the wall can loop without a visible seam.
  const trackRef = useMarquee<HTMLDivElement>(SCROLL_SPEED, expandedKey !== null)

  return (
    <div className={styles.viewport}>
      <div className={styles.track} ref={trackRef}>
        {[0, 1].map((copy) =>
          columns.map((column, columnIndex) => {
            const keyFor = (animal: GalleryItem) => `${copy}-${animal.id}`

            return (
              <div
                key={`${copy}-${columnIndex}`}
                className={styles.column}
                // The second copy is the same content again, so it is hidden
                // from screen readers to avoid reading every animal twice.
                aria-hidden={copy === 1 || undefined}
              >
                {column.map((animal) => (
                  <AnimalTile
                    key={keyFor(animal)}
                    animal={animal}
                    expanded={keyFor(animal) === expandedKey}
                    dimmed={expandedKey !== null && keyFor(animal) !== expandedKey}
                    onMouseEnter={() => enter(keyFor(animal))}
                    onMouseLeave={leave}
                  />
                ))}
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}
