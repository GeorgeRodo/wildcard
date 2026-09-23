import { useEffect, useRef } from 'react'

/**
 * Scrolls an element leftwards forever, at `pixelsPerSecond`.
 *
 * The element is expected to hold two identical copies of its contents:
 * once the first copy has gone past, the offset jumps back by half the
 * track's width, which lands on the matching item and looks seamless.
 *
 * The offset is kept in a ref and written straight to the element's
 * transform, so scrolling doesn't re-render the component every frame.
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
    let previous = performance.now()

    let frame = requestAnimationFrame(function step(now) {
      // Browsers stop animating hidden tabs, so the first frame back can
      // report a gap of many seconds. Capping it avoids a sudden jump.
      const elapsed = Math.min((now - previous) / 1000, 0.05)
      previous = now

      if (!pausedRef.current) {
        offset -= pixelsPerSecond * elapsed

        const copyWidth = track.scrollWidth / 2
        if (copyWidth > 0 && offset <= -copyWidth) {
          offset += copyWidth
        }

        track.style.transform = `translate3d(${offset}px, 0, 0)`
      }

      frame = requestAnimationFrame(step)
    })

    return () => cancelAnimationFrame(frame)
  }, [pixelsPerSecond])

  return trackRef
}
