import { describe, expect, it } from 'vitest'
import { chunk } from './chunk'

describe('chunk', () => {
  it('splits items into groups of the given size', () => {
    expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ])
  })

  it('leaves a short last group when the items do not divide evenly', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('returns no groups for no items', () => {
    expect(chunk([], 4)).toEqual([])
  })
})
