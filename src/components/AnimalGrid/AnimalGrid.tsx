import type { GalleryItem } from '../../data/gallery'
import { splitIntoRows } from '../../utils/splitIntoRows'
import { AnimalTile } from '../AnimalTile'
import styles from './AnimalGrid.module.css'

interface AnimalGridProps {
  animals: GalleryItem[]
}

export function AnimalGrid({ animals }: AnimalGridProps) {
  const rows = splitIntoRows(animals)

  return (
    <div className={styles.grid}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((animal) => (
            <AnimalTile key={animal.id} animal={animal} />
          ))}
        </div>
      ))}
    </div>
  )
}
