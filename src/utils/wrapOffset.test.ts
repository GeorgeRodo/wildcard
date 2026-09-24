import { describe, expect, it } from 'vitest'
import { wrapOffset } from './wrapOffset'

describe('wrapOffset', () => {
  it('leaves an offset within one copy alone', () => {
    expect(wrapOffset(-250, 1000)).toBe(-250)
    expect(wrapOffset(0, 1000)).toBe(0)
  })

  it('wraps an offset that has scrolled past a whole copy to the left', () => {
    expect(wrapOffset(-1250, 1000)).toBe(-250)
    expect(wrapOffset(-3100, 1000)).toBe(-100)
  })

  it('wraps an offset dragged to the right of the start', () => {
    expect(wrapOffset(300, 1000)).toBe(-700)
    expect(wrapOffset(2300, 1000)).toBe(-700)
  })

  it('never lands outside (-width, 0]', () => {
    for (const offset of [-5000, -1000, -999.5, -1, 0, 1, 999, 1000, 4321]) {
      const wrapped = wrapOffset(offset, 1000)
      expect(wrapped).toBeLessThanOrEqual(0)
      expect(wrapped).toBeGreaterThan(-1000)
    }
  })

  it('does nothing before the track has a width', () => {
    expect(wrapOffset(-50, 0)).toBe(-50)
  })
})
