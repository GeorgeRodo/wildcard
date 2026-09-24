import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHoverIntent } from './useHoverIntent'

const DELAY = 400

describe('useHoverIntent', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('with a mouse', () => {
    it('opens an item only after the pointer has rested on it', () => {
      const { result } = renderHook(() => useHoverIntent<string>(DELAY))

      act(() => result.current.enter('fox'))
      act(() => vi.advanceTimersByTime(DELAY - 1))
      expect(result.current.active).toBeNull()

      act(() => vi.advanceTimersByTime(1))
      expect(result.current.active).toBe('fox')
    })

    it('ignores an item the pointer only passes over', () => {
      const { result } = renderHook(() => useHoverIntent<string>(DELAY))

      act(() => result.current.enter('fox'))
      act(() => vi.advanceTimersByTime(100))
      act(() => result.current.leave())
      act(() => vi.advanceTimersByTime(DELAY))

      expect(result.current.active).toBeNull()
    })

    it('closes as soon as the pointer leaves', () => {
      const { result } = renderHook(() => useHoverIntent<string>(DELAY))

      act(() => result.current.enter('fox'))
      act(() => vi.advanceTimersByTime(DELAY))
      act(() => result.current.leave())

      expect(result.current.active).toBeNull()
    })
  })

  describe('with a finger', () => {
    it('opens an item straight away on tap', () => {
      const { result } = renderHook(() => useHoverIntent<string>(DELAY))

      act(() => result.current.toggle('fox'))

      expect(result.current.active).toBe('fox')
    })

    it('closes it on a second tap', () => {
      const { result } = renderHook(() => useHoverIntent<string>(DELAY))

      act(() => result.current.toggle('fox'))
      act(() => result.current.toggle('fox'))

      expect(result.current.active).toBeNull()
    })

    it('switches when a different item is tapped', () => {
      const { result } = renderHook(() => useHoverIntent<string>(DELAY))

      act(() => result.current.toggle('fox'))
      act(() => result.current.toggle('owl'))

      expect(result.current.active).toBe('owl')
    })

    it('cancels a pending hover so it cannot reopen something later', () => {
      const { result } = renderHook(() => useHoverIntent<string>(DELAY))

      act(() => result.current.enter('fox'))
      act(() => result.current.toggle('owl'))
      act(() => vi.advanceTimersByTime(DELAY))

      expect(result.current.active).toBe('owl')
    })
  })
})
