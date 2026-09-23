import { useEffect } from 'react'
import type { GalleryItem } from '../../data/gallery'
import type { ShuffleStatus } from '../../hooks/useShuffle'
import styles from './AnimalShowcase.module.css'

interface AnimalShowcaseProps {
  animal: GalleryItem | null
  status: ShuffleStatus
  onShuffleAgain: () => void
  onClose: () => void
}

export function AnimalShowcase({
  animal,
  status,
  onShuffleAgain,
  onClose,
}: AnimalShowcaseProps) {
  const open = status !== 'idle'

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open || !animal) return null

  const settled = status === 'done'

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Random animal"
      onClick={onClose}
    >
      {/* The card handles its own clicks so tapping it doesn't close. */}
      <figure
        className={styles.card}
        data-settled={settled || undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <img className={styles.image} src={animal.image} alt={animal.name} />

        <figcaption className={styles.info} aria-live="polite">
          <h2 className={styles.name}>{animal.name}</h2>
          <p className={styles.scientificName}>{animal.scientificName}</p>

          {settled && (
            <>
              <p className={styles.description}>{animal.description}</p>
              <p className={styles.fact}>
                <span className={styles.factLabel}>Weird fact</span>
                {animal.fact}
              </p>

              <div className={styles.actions}>
                <button type="button" className={styles.again} onClick={onShuffleAgain}>
                  Shuffle again
                </button>
                <button type="button" className={styles.close} onClick={onClose}>
                  Close
                </button>
              </div>
            </>
          )}
        </figcaption>
      </figure>
    </div>
  )
}
