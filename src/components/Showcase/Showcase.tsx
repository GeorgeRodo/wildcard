import { useEffect } from 'react'
import type { Species } from '../../api/inaturalist'
import type { GalleryItem } from '../../data/gallery'
import styles from './Showcase.module.css'

export type ShowcasePhase = 'shuffling' | 'loading' | 'ready' | 'error'

interface ShowcaseProps {
  phase: ShowcasePhase
  /** Photo flicked through while the shuffle runs. */
  teaser: GalleryItem | null
  species: Species | null
  error: string | null
  onShuffleAgain: () => void
  onRetry: () => void
  onClose: () => void
}

export function Showcase({
  phase,
  teaser,
  species,
  error,
  onShuffleAgain,
  onRetry,
  onClose,
}: ShowcaseProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const ready = phase === 'ready' && species !== null

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Random animal"
      onClick={onClose}
    >
      {/* Clicks on the card itself shouldn't close the dialog. */}
      <div
        className={styles.card}
        data-settled={ready || undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {phase === 'error' ? (
          <div className={styles.message} role="alert">
            <h2 className={styles.name}>No luck</h2>
            <p className={styles.summary}>{error}</p>
            <div className={styles.actions}>
              <button type="button" className={styles.primary} onClick={onRetry}>
                Try again
              </button>
              <button type="button" className={styles.secondary} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <img
              className={styles.image}
              src={ready ? species.photo.url : (teaser?.image ?? '')}
              alt={ready ? species.name : ''}
              key={ready ? species.photo.url : teaser?.id}
            />

            <div className={styles.info} aria-live="polite">
              {ready ? (
                <>
                  <p className={styles.group}>
                    {species.group}
                    {species.conservationStatus && (
                      <span className={styles.status}>{species.conservationStatus}</span>
                    )}
                  </p>

                  <h2 className={styles.name}>{species.name}</h2>
                  {/* Many species have no common name, and the API falls back
                      to the scientific one. Don't print it twice. */}
                  {species.name !== species.scientificName && (
                    <p className={styles.scientificName}>{species.scientificName}</p>
                  )}

                  {species.summary && <p className={styles.summary}>{species.summary}</p>}

                  <p className={styles.meta}>
                    {species.observationCount !== null && (
                      <span>{species.observationCount.toLocaleString()} sightings</span>
                    )}
                    <a
                      className={styles.link}
                      href={species.inaturalistUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on iNaturalist
                    </a>
                  </p>

                  <p className={styles.credit}>Photo: {species.photo.attribution}</p>

                  <div className={styles.actions}>
                    <button type="button" className={styles.primary} onClick={onShuffleAgain}>
                      Shuffle again
                    </button>
                    <button type="button" className={styles.secondary} onClick={onClose}>
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <p className={styles.searching}>
                  {phase === 'loading' ? 'Finding a wild one…' : 'Shuffling…'}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
