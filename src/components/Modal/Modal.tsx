import { useEffect, useRef, type ReactNode } from 'react'
import styles from './Modal.module.css'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Dialogs currently open, oldest first. Credits can open on top of the
 * shuffle card, and only the top one should react to the keyboard:
 * otherwise one press of Escape would close both.
 */
const openDialogs: HTMLElement[] = []

interface ModalProps {
  /** Read out by screen readers when the dialog opens. */
  label: string
  onClose: () => void
  children: ReactNode
}

/**
 * A dialog over the page. Handles what every dialog needs, so its users
 * don't have to: Escape and clicking outside close it, focus moves into it
 * when it opens and back to whatever opened it when it closes, and Tab
 * cycles through its own controls rather than wandering onto the page
 * behind. When dialogs stack, only the top one listens.
 */
export function Modal({ label, onClose, children }: ModalProps) {
  const dialog = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = dialog.current
    if (!element) return

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    openDialogs.push(element)
    element.focus()

    return () => {
      openDialogs.splice(openDialogs.indexOf(element), 1)
      opener?.focus()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (openDialogs.at(-1) !== dialog.current) return

      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialog.current) return

      const focusable = [...dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || active === dialog.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        ref={dialog}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        // Clicks inside the dialog shouldn't reach the backdrop and close it.
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
