export interface Rect {
  left: number
  top: number
  right: number
  bottom: number
}

const hasArea = (rect: Rect) => rect.right > rect.left && rect.bottom > rect.top

/**
 * Whether two rectangles overlap, or come within `margin` of each other.
 * Rectangles with no area never overlap anything.
 */
export function rectsOverlap(a: Rect, b: Rect, margin = 0) {
  if (!hasArea(a) || !hasArea(b)) return false

  return (
    a.left < b.right + margin &&
    a.right > b.left - margin &&
    a.top < b.bottom + margin &&
    a.bottom > b.top - margin
  )
}
