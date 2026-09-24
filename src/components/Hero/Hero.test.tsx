import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Rect } from '../../utils/rects'
import { Hero } from './Hero'

// jsdom doesn't lay anything out, so place the title where it would be on
// a desktop screen: centred, about 500 by 180 pixels.
const TITLE_BOX = { left: 710, top: 380, right: 1210, bottom: 560, width: 500, height: 180 }

const area = (left: number, top: number, width: number, height: number): Rect => ({
  left,
  top,
  right: left + width,
  bottom: top + height,
})

const isFaded = () =>
  screen.getByRole('heading', { name: 'Wildcard' }).closest('[data-faded]') !== null

describe('Hero', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
      TITLE_BOX as DOMRect,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the title when no photo is open', () => {
    render(<Hero onShuffle={() => {}} />)
    expect(isFaded()).toBe(false)
  })

  it('fades out for a photo that would cover it', () => {
    render(<Hero onShuffle={() => {}} obstruction={area(650, 300, 430, 250)} />)
    expect(isFaded()).toBe(true)
  })

  it('stays put for a photo opened well away from it', () => {
    render(<Hero onShuffle={() => {}} obstruction={area(0, 0, 430, 250)} />)
    expect(isFaded()).toBe(false)
  })

  it('also steps aside for a photo that only comes very close', () => {
    render(<Hero onShuffle={() => {}} obstruction={area(270, 400, 430, 150)} />)
    expect(isFaded()).toBe(true)
  })

  it('comes back once the photo closes', () => {
    const { rerender } = render(
      <Hero onShuffle={() => {}} obstruction={area(650, 300, 430, 250)} />,
    )
    expect(isFaded()).toBe(true)

    rerender(<Hero onShuffle={() => {}} obstruction={null} />)
    expect(isFaded()).toBe(false)
  })
})
