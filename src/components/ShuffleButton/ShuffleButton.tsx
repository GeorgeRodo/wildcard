import styles from './ShuffleButton.module.css'

interface ShuffleButtonProps {
  onClick: () => void
}

export function ShuffleButton({ onClick }: ShuffleButtonProps) {
  return (
    // Enter spins from anywhere on the page; see App.
    <button type="button" className={styles.button} aria-keyshortcuts="Enter" onClick={onClick}>
      Spin the wild
    </button>
  )
}
