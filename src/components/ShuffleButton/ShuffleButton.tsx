import styles from './ShuffleButton.module.css'

interface ShuffleButtonProps {
  onClick: () => void
}

export function ShuffleButton({ onClick }: ShuffleButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      Spin the wild
    </button>
  )
}
