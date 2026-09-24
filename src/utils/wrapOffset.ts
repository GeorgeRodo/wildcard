/**
 * Keeps a looping track's offset within one copy's width, in either
 * direction. The track holds two identical copies side by side, so any
 * offset from 0 down to -width shows the same thing as one a whole copy
 * further along, and jumping between them is invisible.
 *
 *   wrapOffset(-1250, 1000) -> -250
 *   wrapOffset(300, 1000)   -> -700
 */
export function wrapOffset(offset: number, width: number) {
  if (width <= 0) return offset

  const wrapped = offset % width
  // Always land in (-width, 0], so the second copy is what fills the gap.
  return wrapped > 0 ? wrapped - width : wrapped
}
