import { describe, expect, it } from 'vitest'
import { rectsOverlap, type Rect } from './rects'

const rect = (left: number, top: number, width: number, height: number): Rect => ({
  left,
  top,
  right: left + width,
  bottom: top + height,
})

describe('rectsOverlap', () => {
  const title = rect(700, 380, 500, 180)

  it('spots a rectangle that covers part of another', () => {
    expect(rectsOverlap(rect(650, 350, 100, 100), title)).toBe(true)
  })

  it('spots one inside another', () => {
    expect(rectsOverlap(rect(800, 400, 50, 50), title)).toBe(true)
  })

  it('ignores one well clear', () => {
    expect(rectsOverlap(rect(0, 0, 300, 200), title)).toBe(false)
  })

  it('treats rectangles that only touch as not overlapping', () => {
    expect(rectsOverlap(rect(500, 380, 200, 100), title)).toBe(false)
  })

  it('counts a near miss within the margin', () => {
    const justLeftOfTitle = rect(590, 400, 100, 100)
    expect(rectsOverlap(justLeftOfTitle, title)).toBe(false)
    expect(rectsOverlap(justLeftOfTitle, title, 16)).toBe(true)
  })

  it('never overlaps a rectangle with no area', () => {
    expect(rectsOverlap(rect(800, 400, 0, 0), title, 100)).toBe(false)
  })
})
