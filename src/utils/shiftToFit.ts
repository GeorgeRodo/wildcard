export interface Box {
  left: number
  top: number
  width: number
  height: number
}

export interface Size {
  width: number
  height: number
}

/**
 * How far to move a box that is about to be scaled up from its centre, so
 * the scaled box stays at least `margin` inside the viewport. A tile on the
 * right edge gets pushed left, one on the bottom row gets pushed up, and a
 * tile in the middle doesn't move at all.
 *
 *   shiftToFit({ left: 0, top: 0, width: 100, height: 100 }, 1.5, { width: 1000, height: 1000 })
 *     -> { x: 25, y: 25 }
 */
export function shiftToFit(box: Box, scale: number, viewport: Size, margin = 0) {
  return {
    x: shiftAxis(box.left, box.width, scale, viewport.width, margin),
    y: shiftAxis(box.top, box.height, scale, viewport.height, margin),
  }
}

function shiftAxis(start: number, size: number, scale: number, limit: number, margin: number) {
  const grown = size * scale
  const from = start + size / 2 - grown / 2
  const to = from + grown

  // Too big to fit either way: keep it centred rather than favour one side.
  if (grown > limit - margin * 2) return 0
  if (from < margin) return margin - from
  if (to > limit - margin) return limit - margin - to
  return 0
}
