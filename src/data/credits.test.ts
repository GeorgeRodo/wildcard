import { describe, expect, it } from 'vitest'
import { photoCredits } from './credits'
import { gallery } from './gallery'

describe('photoCredits', () => {
  it('has a credit for every photo on the wall', () => {
    const credited = new Set(photoCredits.map((credit) => credit.animal))
    const uncredited = gallery.filter((animal) => !credited.has(animal.name))

    expect(uncredited.map((animal) => animal.name)).toEqual([])
  })

  it('reads every column of every row', () => {
    for (const credit of photoCredits) {
      expect(credit.photographer).not.toBe('')
      expect(credit.licence).not.toBe('')
      expect(credit.source).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
    }
  })

  it('skips the header and divider rows of the table', () => {
    const names = photoCredits.map((credit) => credit.animal)
    expect(names).not.toContain('Animal')
    expect(names.some((name) => name.startsWith('-'))).toBe(false)
  })
})
