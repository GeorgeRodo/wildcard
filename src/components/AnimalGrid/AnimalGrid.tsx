import type { GalleryItem } from '../../data/gallery'
import { useHoverIntent } from '../../hooks/useHoverIntent'
import { splitIntoRows } from '../../utils/splitIntoRows'
import { AnimalTile } from '../AnimalTile'
import styles from './AnimalGrid.module.css'

/** How long the pointer has to rest on a photo before it expands. */
const HOVER_DELAY_MS = 400

interface AnimalGridProps {
  animals: GalleryItem[]
}

export function AnimalGrid({ animals }: AnimalGridProps) {
  const rows = splitIntoRows(animals)
  const { active: expandedId, enter, leave } = useHoverIntent<string>(HOVER_DELAY_MS)

  return (
    <div className={styles.grid}>
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={styles.row}
          data-expanded={row.some((animal) => animal.id === expandedId) || undefined}
        >
          {row.map((animal) => (
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
  )
}
