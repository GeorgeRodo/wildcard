import type { GalleryItem } from '../../data/gallery'
import { useHoverIntent } from '../../hooks/useHoverIntent'
import { chunk } from '../../utils/chunk'
import { AnimalTile } from '../AnimalTile'
import styles from './AnimalGrid.module.css'

/** Rows on screen. The number of columns follows from how many animals there are. */
const ROWS = 4

/** How long the pointer has to rest on a photo before it expands. */
const HOVER_DELAY_MS = 400

interface AnimalGridProps {
  animals: GalleryItem[]
}

export function AnimalGrid({ animals }: AnimalGridProps) {
  const columns = chunk(animals, ROWS)
  const { active: expandedId, enter, leave } = useHoverIntent<string>(HOVER_DELAY_MS)

  return (
    <div className={styles.viewport}>
      <div className={styles.track}>
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={styles.column}
            data-expanded={column.some((animal) => animal.id === expandedId) || undefined}
          >
            {column.map((animal) => (
              <AnimalTile
                key={animal.id}
                animal={animal}
                expanded={animal.id === expandedId}
                dimmed={expandedId !== null && animal.id !== expandedId}
                onMouseEnter={() => enter(animal.id)}
                onMouseLeave={leave}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
