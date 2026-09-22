import type { GalleryItem } from '../../data/gallery'
import styles from './AnimalTile.module.css'

interface AnimalTileProps {
  animal: GalleryItem
}

export function AnimalTile({ animal }: AnimalTileProps) {
  return (
    // tabIndex makes the tile focusable, so the details also open via
    // keyboard and on tap for touch screens.
    <figure className={styles.tile} tabIndex={0}>
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
