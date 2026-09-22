import type { GalleryItem } from '../../data/gallery'
import styles from './AnimalTile.module.css'

interface AnimalTileProps {
  animal: GalleryItem
}

export function AnimalTile({ animal }: AnimalTileProps) {
  return (
    <figure className={styles.tile}>
      <img className={styles.image} src={animal.image} alt={animal.name} />
    </figure>
  )
}
