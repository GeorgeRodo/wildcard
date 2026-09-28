import { describe, expect, it } from 'vitest'
import { cleanSummary, largePhoto } from './format'

describe('cleanSummary', () => {
  it('strips tags and the pronunciation asides Wikipedia leaves behind', () => {
    expect(cleanSummary('<p>The <b>okapi</b> (help·info) ( ) is shy .</p>')).toBe(
      'The okapi is shy.',
    )
  })

  it('gives an empty string for a missing summary', () => {
    expect(cleanSummary(null)).toBe('')
    expect(cleanSummary(undefined)).toBe('')
  })

  it('trims a long summary back to its last full sentence', () => {
    const sentence = 'This sentence is here to make the summary long enough to trim. '
    const summary = cleanSummary(sentence.repeat(10))

    expect(summary.length).toBeLessThanOrEqual(360)
    expect(summary.endsWith('trim.')).toBe(true)
  })

  it('cuts mid-sentence with an ellipsis when no sentence ends early enough', () => {
    const summary = cleanSummary('word '.repeat(100))

    expect(summary.endsWith('…')).toBe(true)
    expect(summary.length).toBeLessThanOrEqual(361)
  })
})

describe('largePhoto', () => {
  it('asks for the large size of a photo', () => {
    expect(largePhoto('https://static.inaturalist.org/photos/1/medium.jpg')).toBe(
      'https://static.inaturalist.org/photos/1/large.jpg',
    )
  })

  it('leaves a URL that is already large alone', () => {
    const url = 'https://static.inaturalist.org/photos/1/large.jpeg'
    expect(largePhoto(url)).toBe(url)
  })
})
