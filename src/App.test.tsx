import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Species } from './api/inaturalist'
import App from './App'

// jsdom has no Web Audio, and the tests shouldn't touch the real database.
vi.mock('./audio/sfx', () => ({
  playTick: vi.fn(),
  playReveal: vi.fn(),
  playError: vi.fn(),
  setMuted: vi.fn(),
}))

let served = 0
vi.mock('./api/supabase', () => ({
  supabaseConfigured: true,
  fetchRandomAnimal: vi.fn(async (): Promise<Species> => {
    served += 1
    return {
      taxonId: served,
      name: `Test animal ${served}`,
      scientificName: `Testus animalis ${served}`,
      group: 'Mammalia',
      summary: 'A made-up animal for tests.',
      conservationStatus: null,
      observationCount: 10,
      photo: { url: `https://example.com/${served}.jpg`, attribution: 'Test' },
      place: null,
      inaturalistUrl: `https://www.inaturalist.org/taxa/${served}`,
    }
  }),
}))

/** Lets timers and the promises waiting on them run. */
const wait = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })

const spinAgainButton = () => screen.queryByRole('button', { name: 'Spin again' })

describe('App', () => {
  beforeEach(() => {
    served = 0
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shuffles, then lands on an animal from the database', async () => {
    render(<App />)
    await wait(3000)

    fireEvent.click(screen.getByRole('button', { name: 'Spin the wild' }))
    expect(screen.getByRole('dialog', { name: 'Random animal' })).toBeInTheDocument()
    expect(spinAgainButton()).not.toBeInTheDocument()

    await wait(3000)

    expect(screen.getByRole('heading', { name: /^Test animal/ })).toBeInTheDocument()
    expect(spinAgainButton()).toBeInTheDocument()
  })

  // Regression: the shuffle used to stop when the request's status changed.
  // "Spin again" with an animal already prefetched goes from success to
  // success, which is no change, so the shuffle never stopped.
  it('settles again after "Spin again" when the next animal is already waiting', async () => {
    render(<App />)
    await wait(3000)

    fireEvent.click(screen.getByRole('button', { name: 'Spin the wild' }))
    await wait(3000)
    const first = screen.getByRole('heading', { name: /^Test animal/ }).textContent

    // Give the background prefetch time to have the next animal ready.
    await wait(3000)

    fireEvent.click(spinAgainButton()!)
    expect(spinAgainButton()).not.toBeInTheDocument()

    await wait(3000)

    expect(spinAgainButton()).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^Test animal/ }).textContent).not.toBe(first)
  })

  it('opens a photo on the wall with a tap, and closes it with another', () => {
    render(<App />)
    const tile = screen.getAllByRole('figure')[0]
    const tap = () => {
      fireEvent.pointerDown(tile, { pointerType: 'touch' })
      fireEvent.pointerUp(tile, { pointerType: 'touch' })
      fireEvent.click(tile)
    }

    tap()
    expect(tile).toHaveAttribute('data-expanded')

    tap()
    expect(tile).not.toHaveAttribute('data-expanded')
  })

  it('only closes an open photo when another is tapped, without opening that one', () => {
    render(<App />)
    const [first, second] = screen.getAllByRole('figure')
    const tap = (tile: HTMLElement) => {
      fireEvent.pointerDown(tile, { pointerType: 'touch' })
      fireEvent.pointerUp(tile, { pointerType: 'touch' })
      fireEvent.click(tile)
    }

    tap(first)
    expect(first).toHaveAttribute('data-expanded')

    // Tapping away closes the open photo, and that's all it does.
    tap(second)
    expect(first).not.toHaveAttribute('data-expanded')
    expect(second).not.toHaveAttribute('data-expanded')

    // The next tap is an ordinary one again.
    tap(second)
    expect(second).toHaveAttribute('data-expanded')
  })

  it('closes the card and hands focus back to the button', async () => {
    render(<App />)
    await wait(3000)

    const pick = screen.getByRole('button', { name: 'Spin the wild' })
    pick.focus()
    fireEvent.click(pick)
    await wait(3000)

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(pick).toHaveFocus()
  })
})
