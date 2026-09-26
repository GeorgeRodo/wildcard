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
/** How long the mocked database takes to answer. */
let latency = 0
vi.mock('./api/supabase', () => ({
  supabaseConfigured: true,
  fetchRandomAnimal: vi.fn(async (): Promise<Species> => {
    await new Promise((resolve) => setTimeout(resolve, latency))
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
    latency = 0
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

  it('stops the wall moving with the pause button, and starts it again', async () => {
    localStorage.clear()
    render(<App />)
    const track = screen.getAllByRole('figure')[0].parentElement!.parentElement!
    const offset = () => Number(/translate3d\((-?[\d.e-]+)px/.exec(track.style.transform)?.[1] ?? 0)
    const pause = screen.getByRole('button', { name: 'Pause the wall' })

    await wait(1000)
    expect(offset()).toBeLessThan(0)

    fireEvent.click(pause)
    expect(pause).toHaveAttribute('aria-pressed', 'true')
    const stoppedAt = offset()
    await wait(2000)
    expect(offset()).toBe(stoppedAt)

    fireEvent.click(pause)
    expect(pause).toHaveAttribute('aria-pressed', 'false')
    await wait(1000)
    expect(offset()).toBeLessThan(stoppedAt)
  })

  it('starts with the wall still when the system asks for less motion', () => {
    localStorage.clear()
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
    }))

    try {
      render(<App />)
      expect(screen.getByRole('button', { name: 'Pause the wall' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
    } finally {
      vi.unstubAllGlobals()
    }
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

  // Regression: a card closed while its animal was still loading used to
  // open itself again, with a chime, once the answer arrived.
  it('stays closed when closed before the animal has arrived', async () => {
    const { playReveal } = await import('./audio/sfx')
    vi.mocked(playReveal).mockClear()
    latency = 8000
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Spin the wild' }))
    await wait(2000)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await wait(20000)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(playReveal).not.toHaveBeenCalled()
  })
})
