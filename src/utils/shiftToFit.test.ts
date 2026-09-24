import { describe, expect, it } from 'vitest'
import { shiftToFit, type Box } from './shiftToFit'

const viewport = { width: 1920, height: 945 }
const SCALE = 1.35
const MARGIN = 8

const tileAt = (left: number, top: number): Box => ({ left, top, width: 320, height: 189 })

/** Where a box ends up after being shifted and then scaled from its centre. */
function grownBox(box: Box, shift: { x: number; y: number }) {
  const width = box.width * SCALE
  const height = box.height * SCALE
  const left = box.left + box.width / 2 - width / 2 + shift.x
  const top = box.top + box.height / 2 - height / 2 + shift.y
  return { left, top, right: left + width, bottom: top + height }
}

describe('shiftToFit', () => {
  it('leaves a tile in the middle of the screen where it is', () => {
    expect(shiftToFit(tileAt(800, 378), SCALE, viewport, MARGIN)).toEqual({ x: 0, y: 0 })
  })

  it.each([
    ['top-left corner', tileAt(0, 0)],
    ['bottom row', tileAt(800, 756)],
    ['right edge', tileAt(1600, 378)],
    ['bottom-right corner', tileAt(1600, 756)],
    ['half scrolled off the left', tileAt(-150, 378)],
  ])('keeps a tile on the %s inside the window', (_, box) => {
    const grown = grownBox(box, shiftToFit(box, SCALE, viewport, MARGIN))

    expect(grown.left).toBeGreaterThanOrEqual(MARGIN - 0.001)
    expect(grown.top).toBeGreaterThanOrEqual(MARGIN - 0.001)
    expect(grown.right).toBeLessThanOrEqual(viewport.width - MARGIN + 0.001)
    expect(grown.bottom).toBeLessThanOrEqual(viewport.height - MARGIN + 0.001)
  })

  it('pushes edge tiles inwards, towards the middle', () => {
    const shift = shiftToFit(tileAt(1600, 756), SCALE, viewport, MARGIN)
    expect(shift.x).toBeLessThan(0)
    expect(shift.y).toBeLessThan(0)
  })

  it('keeps a box too big to fit centred rather than favouring one side', () => {
    const huge = { left: 0, top: 0, width: 1900, height: 900 }
    expect(shiftToFit(huge, SCALE, viewport, MARGIN)).toEqual({ x: 0, y: 0 })
  })
})
