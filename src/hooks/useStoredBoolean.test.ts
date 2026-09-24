import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useStoredBoolean } from './useStoredBoolean'

const KEY = 'test:setting'

describe('useStoredBoolean', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('starts from the default when nothing is stored', () => {
    const { result } = renderHook(() => useStoredBoolean(KEY, true))
    expect(result.current[0]).toBe(true)
  })

  it('remembers a change for the next visit', () => {
    const first = renderHook(() => useStoredBoolean(KEY, true))
    act(() => first.result.current[1](false))
    first.unmount()

    const next = renderHook(() => useStoredBoolean(KEY, true))
    expect(next.result.current[0]).toBe(false)
  })

  it('still works when storage is blocked, it just forgets', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    const { result } = renderHook(() => useStoredBoolean(KEY, true))
    expect(result.current[0]).toBe(true)

    act(() => result.current[1](false))
    expect(result.current[0]).toBe(false)
  })
})
