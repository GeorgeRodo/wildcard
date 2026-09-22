import { splitIntoRows } from '../../utils/splitIntoRows'
import styles from './BackgroundGrid.module.css'

interface BackgroundGridProps {
  images: string[]
}

export function BackgroundGrid({ images }: BackgroundGridProps) {
  const rows = splitIntoRows(images)

  return (
    <div className={styles.grid} aria-hidden="true">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((src) => (
            <img key={src} className={styles.cell} src={src} alt="" />
          ))}
        </div>
      ))}
    </div>
  )
}
