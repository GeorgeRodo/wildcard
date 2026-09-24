import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

function renderModal(onClose = vi.fn()) {
  render(
    <Modal label="Test dialog" onClose={onClose}>
      <div>
        <button type="button">First</button>
        <button type="button">Last</button>
      </div>
    </Modal>,
  )
  return onClose
}

const pressKey = (key: string, shiftKey = false) =>
  fireEvent.keyDown(window, { key, shiftKey })

describe('Modal', () => {
  it('moves focus into the dialog when it opens', () => {
    renderModal()
    expect(screen.getByRole('dialog', { name: 'Test dialog' })).toHaveFocus()
  })

  it('closes on Escape', () => {
    const onClose = renderModal()
    pressKey('Escape')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes on a click outside the dialog, but not inside it', () => {
    const onClose = renderModal()
    const dialog = screen.getByRole('dialog')

    fireEvent.click(screen.getByRole('button', { name: 'First' }))
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(dialog.parentElement!)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('keeps Tab inside the dialog, in both directions', () => {
    renderModal()
    const first = screen.getByRole('button', { name: 'First' })
    const last = screen.getByRole('button', { name: 'Last' })

    last.focus()
    pressKey('Tab')
    expect(first).toHaveFocus()

    pressKey('Tab', true)
    expect(last).toHaveFocus()
  })

  it('gives focus back to whatever opened it', () => {
    render(<button type="button">Opener</button>)
    const opener = screen.getByRole('button', { name: 'Opener' })
    opener.focus()

    const { unmount } = render(
      <Modal label="Test dialog" onClose={() => {}}>
        <div />
      </Modal>,
    )
    expect(opener).not.toHaveFocus()

    unmount()
    expect(opener).toHaveFocus()
  })

  it('only lets the top dialog react when two are open', () => {
    const closeBottom = vi.fn()
    const closeTop = vi.fn()

    render(
      <>
        <Modal label="Bottom" onClose={closeBottom}>
          <div />
        </Modal>
        <Modal label="Top" onClose={closeTop}>
          <div />
        </Modal>
      </>,
    )

    pressKey('Escape')
    expect(closeTop).toHaveBeenCalledOnce()
    expect(closeBottom).not.toHaveBeenCalled()
  })
})
