import { useLayoutEffect, useRef } from 'react'
import type { GalleryItem } from '../../data/gallery'
import { shiftToFit } from '../../utils/shiftToFit'
import styles from './AnimalTile.module.css'

/** Keep an expanded tile at least this far from the window edges. */
const EDGE_MARGIN = 8

interface AnimalTileProps {
  animal: GalleryItem
  expanded: boolean
  dimmed: boolean
  /** A mouse moved onto the photo. */
  onHoverStart: () => void
  /** A mouse moved off it. */
  onHoverEnd: () => void
  /** A finger or pen tapped it. */
  onTap: () => void
}

export function AnimalTile({
  animal,
  expanded,
  dimmed,
  onHoverStart,
  onHoverEnd,
  onTap,
}: AnimalTileProps) {
  const ref = useRef<HTMLElement>(null)
  // Phones fire fake mouse events after a tap, so what matters is the kind
  // of pointer that started the interaction, not the event that follows.
  const pointerType = useRef('mouse')

  // A tile scales up from its centre, so one on the edge of the window would
  // grow past it and get cut off. Work out how far to nudge it back inside
  // before the browser paints, so the grow animation already heads there.
  // It has to be measured each time: the wall scrolls, so which tiles sit on
  // the left and right edges keeps changing.
  useLayoutEffect(() => {
    const tile = ref.current
    const column = tile?.parentElement
    if (!expanded || !tile || !column) return

    // The column's box includes the wall's scroll offset; the tile's own box
    // would already include its scale, so measure the column instead.
    const columnBox = column.getBoundingClientRect()
    const scale = Number.parseFloat(getComputedStyle(tile).getPropertyValue('--expand-scale'))

    const shift = shiftToFit(
      {
        left: columnBox.left,
        top: columnBox.top + tile.offsetTop - column.offsetTop,
        width: tile.offsetWidth,
        height: tile.offsetHeight,
      },
      scale,
      { width: window.innerWidth, height: window.innerHeight },
      EDGE_MARGIN,
    )

    tile.style.setProperty('--shift-x', `${shift.x}px`)
    tile.style.setProperty('--shift-y', `${shift.y}px`)
  }, [expanded])

  return (
    <figure
      ref={ref}
      className={styles.tile}
      data-expanded={expanded || undefined}
      data-dimmed={dimmed || undefined}
      onPointerDown={(event) => {
        pointerType.current = event.pointerType
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') onHoverStart()
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') onHoverEnd()
      }}
      onClick={() => {
        if (pointerType.current !== 'mouse') onTap()
      }}
    >
      <img
        className={styles.image}
        src={animal.imageSmall}
        // The browser picks the smallest file that is sharp enough for the
        // tile's width and the screen's pixel density. Tiles are a sixth of
        // the screen wide, or half on a portrait screen.
        srcSet={`${animal.imageSmall} 600w, ${animal.image} 1200w`}
        sizes="(orientation: portrait) 50vw, 17vw"
        alt={animal.name}
        loading="lazy"
        decoding="async"
      />
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
