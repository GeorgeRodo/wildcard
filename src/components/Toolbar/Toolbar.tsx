import styles from './Toolbar.module.css'

interface ToolbarProps {
  soundOn: boolean
  onToggleSound: () => void
  wallPaused: boolean
  onToggleWall: () => void
  onOpenCredits: () => void
}

export function Toolbar({
  soundOn,
  onToggleSound,
  wallPaused,
  onToggleWall,
  onOpenCredits,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      {/* Content that moves on its own needs a way to stop it (WCAG 2.2.2),
          for anyone who finds the motion distracting or hard to read. */}
      <button
        type="button"
        className={styles.button}
        aria-pressed={wallPaused}
        aria-label="Pause the wall"
        title={wallPaused ? 'Let the wall move again' : 'Stop the wall moving'}
        onClick={onToggleWall}
      >
        {wallPaused ? <PlayIcon /> : <PauseIcon />}
      </button>
      <button
        type="button"
        className={styles.button}
        aria-pressed={soundOn}
        aria-label="Sound"
        title={soundOn ? 'Mute sound' : 'Turn sound on'}
        onClick={onToggleSound}
      >
        <SpeakerIcon muted={!soundOn} />
      </button>
      <button type="button" className={styles.button} onClick={onOpenCredits}>
        Credits
      </button>
    </div>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5z" fill="currentColor" />
    </svg>
  )
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      {muted ? (
        <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path
          d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  )
}
