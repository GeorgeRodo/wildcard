import { useEffect, useRef } from 'react'
import { wrapOffset } from '../utils/wrapOffset'

/** How far a finger has to move before a touch counts as a swipe, not a tap. */
const SWIPE_THRESHOLD_PX = 8
/** How quickly a flick loses speed. Higher stops sooner. */
const FRICTION = 3.5
/** Below this speed a flick has run out and the slow drift takes over. */
const MIN_FLICK_SPEED = 25
/** Upper limit on a flick, so a wild swipe can't send the wall spinning. */
const MAX_FLICK_SPEED = 4000

/**
 * Scrolls an element leftwards forever, at `pixelsPerSecond`, and lets a
 * finger drag it either way. Let go mid-swipe and it glides on, slowing
 * down, before easing back into the drift.
 *
 * The element is expected to hold two identical copies of its contents,
 * so the offset can jump by one copy's width at any time without the jump
 * being visible. See `wrapOffset`.
 *
 * The offset is kept outside React and written straight to the element's
 * transform, so scrolling and dragging never re-render the component.
 *
 * Only touch and pen can drag: with a mouse, hovering over photos is what
 * matters, and dragging would get in its way.
 */
export function useMarquee<T extends HTMLElement>(pixelsPerSecond: number, paused: boolean) {
  const trackRef = useRef<T>(null)
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let offset = 0
    let velocity = 0
    let previous = performance.now()

    let drag: {
      pointerId: number
      startX: number
      startOffset: number
      lastX: number
      lastTime: number
      swiping: boolean
    } | null = null

    // A swipe that started on a photo shouldn't also open it.
    let swallowNextClick = false

    let frame = requestAnimationFrame(function step(now) {
      // Browsers stop animating hidden tabs, so the first frame back can
      // report a gap of many seconds. Capping it avoids a sudden jump.
      const elapsed = Math.min((now - previous) / 1000, 0.05)
      previous = now

      if (!drag) {
        if (Math.abs(velocity) > MIN_FLICK_SPEED) {
          offset += velocity * elapsed
          velocity *= Math.exp(-FRICTION * elapsed)
        } else {
          velocity = 0
          if (!pausedRef.current) offset -= pixelsPerSecond * elapsed
        }
      }

      offset = wrapOffset(offset, track.scrollWidth / 2)
      track.style.transform = `translate3d(${offset}px, 0, 0)`

      frame = requestAnimationFrame(step)
    })

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || drag) return

      velocity = 0
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startOffset: offset,
        lastX: event.clientX,
        lastTime: event.timeStamp,
        swiping: false,
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) return

      const moved = event.clientX - drag.startX
      if (!drag.swiping && Math.abs(moved) < SWIPE_THRESHOLD_PX) return
      drag.swiping = true

      // Follow the finger, and track its speed for when it lets go.
      const dt = (event.timeStamp - drag.lastTime) / 1000
      if (dt > 0) {
        const speed = (event.clientX - drag.lastX) / dt
        velocity = velocity * 0.2 + speed * 0.8
      }
      drag.lastX = event.clientX
      drag.lastTime = event.timeStamp

      offset = drag.startOffset + moved
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) return

      // A finger that stopped before lifting shouldn't fling the wall.
      const heldStill = event.timeStamp - drag.lastTime > 100
      velocity = drag.swiping && !heldStill
        ? Math.max(-MAX_FLICK_SPEED, Math.min(MAX_FLICK_SPEED, velocity))
        : 0

      swallowNextClick = drag.swiping
      drag = null
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!swallowNextClick) return
      swallowNextClick = false
      event.stopPropagation()
      event.preventDefault()
    }

    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('click', onClickCapture, true)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [pixelsPerSecond])

  return trackRef
}
