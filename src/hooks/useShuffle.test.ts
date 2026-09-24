import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useShuffle } from './useShuffle'

const items = ['fox', 'owl', 'lion', 'wolf']

describe('useShuffle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts idle with nothing shown', () => {
    const { result } = renderHook(() => useShuffle(items))

    expect(result.current.status).toBe('idle')
    expect(result.current.current).toBeNull()
  })

  it('flicks through the items and calls onStep for each one', () => {
    const onStep = vi.fn()
    const { result } = renderHook(() => useShuffle(items, onStep))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(1000))

    expect(result.current.status).toBe('shuffling')
    expect(items).toContain(result.current.current)
    expect(onStep.mock.calls.length).toBeGreaterThan(5)
  })

  it('never shows the same item twice in a row', () => {
    const shown: (string | null)[] = []
    let onScreen = (): string | null => null
    const { result } = renderHook(() => useShuffle(items, () => shown.push(onScreen())))
    onScreen = () => result.current.current

    act(() => result.current.start())
    for (let i = 0; i < 40; i++) {
      act(() => vi.advanceTimersByTime(100))
    }

    // onStep runs before React re-renders, so `shown` lags by one step;
    // compare the values that were actually on screen in turn.
    const visible = shown.filter((item) => item !== null)
    for (let i = 1; i < visible.length; i++) {
      expect(visible[i]).not.toBe(visible[i - 1])
    }
  })

  it('keeps going until it is told to settle', () => {
    const { result } = renderHook(() => useShuffle(items))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(30_000))

    expect(result.current.status).toBe('shuffling')
  })

  it('runs for a minimum spell even when settled straight away', () => {
    const { result } = renderHook(() => useShuffle(items))

    act(() => result.current.start())
    act(() => result.current.settle())
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.status).toBe('shuffling')

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.status).toBe('done')
  })

  it('stops at once when settled after the minimum spell', () => {
    const { result } = renderHook(() => useShuffle(items))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(5000))
    act(() => result.current.settle())
    act(() => vi.advanceTimersByTime(0))

    expect(result.current.status).toBe('done')
  })

  it('stops flicking once it is done', () => {
    const onStep = vi.fn()
    const { result } = renderHook(() => useShuffle(items, onStep))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(2000))
    act(() => result.current.settle())
    act(() => vi.advanceTimersByTime(0))

    const steps = onStep.mock.calls.length
    act(() => vi.advanceTimersByTime(5000))
    expect(onStep).toHaveBeenCalledTimes(steps)
  })

  it('goes back to idle on reset', () => {
    const { result } = renderHook(() => useShuffle(items))

    act(() => result.current.start())
    act(() => result.current.reset())

    expect(result.current.status).toBe('idle')
    expect(result.current.current).toBeNull()
  })
})
