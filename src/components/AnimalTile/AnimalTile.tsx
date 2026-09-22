import type { GalleryItem } from '../../data/gallery'
import styles from './AnimalTile.module.css'

interface AnimalTileProps {
  animal: GalleryItem
  expanded: boolean
  dimmed: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function AnimalTile({
  animal,
  expanded,
  dimmed,
  onMouseEnter,
  onMouseLeave,
}: AnimalTileProps) {
  return (
    <figure
      className={styles.tile}
      data-expanded={expanded || undefined}
      data-dimmed={dimmed || undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img className={styles.image} src={animal.image} alt={animal.name} />
      <figcaption className={styles.info}>
        <h2 className={styles.name}>{animal.name}</h2>
        <p className={styles.scientificName}>{animal.scientificName}</p>
        <p className={styles.description}>{animal.description}</p>
        <p className={styles.fact}>
          <span className={styles.factLabel}>Weird fact</span>
          {animal.fact}
        </p>
      </figcaption>
    </figure>
  )
}
