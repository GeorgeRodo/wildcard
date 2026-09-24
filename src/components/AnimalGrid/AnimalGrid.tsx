import { useEffect, useRef, useState } from 'react'
import type { GalleryItem } from '../../data/gallery'
import { useHoverIntent } from '../../hooks/useHoverIntent'
import { useMarquee } from '../../hooks/useMarquee'
import { chunk } from '../../utils/chunk'
import type { Rect } from '../../utils/rects'
import { AnimalTile } from '../AnimalTile'
import styles from './AnimalGrid.module.css'

/** Rows on screen. The number of columns follows from how many animals there are. */
const ROWS = 5

/** How long the pointer has to rest on a photo before it expands. */
const HOVER_DELAY_MS = 400

/** How fast the wall drifts left, in pixels per second. */
const SCROLL_SPEED = 20

interface AnimalGridProps {
  animals: GalleryItem[]
  /** Holds the wall still, e.g. while the showcase is open. */
  paused?: boolean
  /** Called with the area an open photo covers, or null once it closes. */
  onOpenAreaChange?: (area: Rect | null) => void
}

export function AnimalGrid({ animals, paused = false, onOpenAreaChange }: AnimalGridProps) {
  const columns = chunk(animals, ROWS)
  const { active: expandedKey, enter, leave, toggle } = useHoverIntent<string>(HOVER_DELAY_MS)
  // Two copies of the columns, so the wall can loop without a visible seam.
  const trackRef = useMarquee<HTMLDivElement>(SCROLL_SPEED, paused || expandedKey !== null)

  const [grownArea, setGrownArea] = useState<Rect | null>(null)
  const openArea = expandedKey === null ? null : grownArea
  useEffect(() => {
    onOpenAreaChange?.(openArea)
  }, [openArea, onOpenAreaChange])

  // A mouse closes a photo by moving off it. A finger can't, so a tap
  // anywhere other than the open photo closes it instead. That tap is used
  // up by the closing: if it landed on another photo, it mustn't open that
  // one too. Each new touch starts the check afresh.
  const photoOpen = useRef(false)
  const tapClosedPhoto = useRef(false)

  useEffect(() => {
    photoOpen.current = expandedKey !== null
  }, [expandedKey])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      tapClosedPhoto.current = false
      if (event.pointerType === 'mouse' || !photoOpen.current) return

      const target = event.target instanceof Element ? event.target : null
      if (!target?.closest('[data-expanded]')) {
        tapClosedPhoto.current = true
        leave()
      }
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [leave])

  const tap = (key: string) => {
    if (!tapClosedPhoto.current) toggle(key)
  }

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
                    onHoverStart={() => enter(keyFor(animal))}
                    onHoverEnd={leave}
                    onTap={() => tap(keyFor(animal))}
                    onGrown={setGrownArea}
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
