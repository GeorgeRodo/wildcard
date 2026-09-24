import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMarquee } from './useMarquee'

const SPEED = 20
const FRAME = 16

function Track({ paused = false, onTileClick = () => {} }) {
  const ref = useMarquee<HTMLDivElement>(SPEED, paused)
  return (
    <div data-testid="track" ref={ref}>
      <button type="button" onClick={onTileClick}>
        Tile
      </button>
    </div>
  )
}

/** The track's horizontal offset, read back from its transform. */
const offsetOf = (track: HTMLElement) =>
  Number(/translate3d\((-?[\d.e-]+)px/.exec(track.style.transform)?.[1] ?? 0)

let clock = 0
function pointer(target: EventTarget, type: string, clientX: number, pointerType = 'touch') {
  const event = new PointerEvent(type, { pointerType, pointerId: 1, clientX, bubbles: true })
  Object.defineProperty(event, 'timeStamp', { value: clock })
  target.dispatchEvent(event)
}

const frames = (ms: number) =>
  act(() => {
    clock += ms
    vi.advanceTimersByTime(ms)
  })

describe('useMarquee', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clock = 0
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('drifts left at a steady speed', () => {
    const { getByTestId } = render(<Track />)
    frames(1000)
    expect(offsetOf(getByTestId('track'))).toBeCloseTo(-SPEED, 0)
  })

  it('holds still while paused', () => {
    const { getByTestId } = render(<Track paused />)
    frames(1000)
    expect(offsetOf(getByTestId('track'))).toBe(0)
  })

  it('follows a finger dragging it to the right', () => {
    const { getByTestId } = render(<Track paused />)
    const track = getByTestId('track')

    pointer(track, 'pointerdown', 100)
    frames(FRAME)
    pointer(window, 'pointermove', 160)
    frames(FRAME)

    expect(offsetOf(track)).toBeCloseTo(60, 0)
  })

  it('ignores the mouse, which hovers over photos instead', () => {
    const { getByTestId } = render(<Track paused />)
    const track = getByTestId('track')

    pointer(track, 'pointerdown', 100, 'mouse')
    pointer(window, 'pointermove', 300, 'mouse')
    frames(FRAME)

    expect(offsetOf(track)).toBe(0)
  })

  it('glides on after a flick, then slows to a stop', () => {
    const { getByTestId } = render(<Track paused />)
    const track = getByTestId('track')

    pointer(track, 'pointerdown', 300)
    for (const x of [280, 250, 210, 160]) {
      frames(FRAME)
      pointer(window, 'pointermove', x)
    }
    pointer(window, 'pointerup', 160)
    const released = offsetOf(track)

    frames(200)
    const soonAfter = offsetOf(track)
    expect(soonAfter).toBeLessThan(released)

    frames(5000)
    const settled = offsetOf(track)
    frames(1000)
    expect(offsetOf(track)).toBeCloseTo(settled, 0)
  })

  it("doesn't fling the wall when the finger stops before lifting", () => {
    const { getByTestId } = render(<Track paused />)
    const track = getByTestId('track')

    pointer(track, 'pointerdown', 300)
    frames(FRAME)
    pointer(window, 'pointermove', 200)
    frames(300)
    pointer(window, 'pointerup', 200)
    const released = offsetOf(track)

    frames(1000)
    expect(offsetOf(track)).toBeCloseTo(released, 0)
  })

  it("doesn't open the photo a swipe started on", () => {
    const onTileClick = vi.fn()
    const { getByTestId, getByRole } = render(<Track paused onTileClick={onTileClick} />)
    const tile = getByRole('button')

    pointer(tile, 'pointerdown', 100)
    frames(FRAME)
    pointer(window, 'pointermove', 180)
    pointer(window, 'pointerup', 180)
    tile.click()

    expect(onTileClick).not.toHaveBeenCalled()
    expect(getByTestId('track')).toBeInTheDocument()
  })

  it('still lets a plain tap through', () => {
    const onTileClick = vi.fn()
    const { getByRole } = render(<Track paused onTileClick={onTileClick} />)
    const tile = getByRole('button')

    pointer(tile, 'pointerdown', 100)
    pointer(window, 'pointerup', 102)
    tile.click()

    expect(onTileClick).toHaveBeenCalledOnce()
  })
})
