import { photoCredits } from '../../data/credits'
import { Modal } from '../Modal'
import styles from './Credits.module.css'

const TECH_STACK = [
  'React',
  'TypeScript',
  'Vite',
  'CSS Modules',
  'Supabase',
  'PostgreSQL',
  'iNaturalist API',
  'Web Audio API',
  'sharp',
  'Oxlint',
]

interface CreditsProps {
  onClose: () => void
}

export function Credits({ onClose }: CreditsProps) {
  return (
    <Modal label="Credits" onClose={onClose}>
      <section className={styles.panel}>
        <header className={styles.header}>
          <h2 className={styles.title}>Credits</h2>
          <button type="button" className={styles.close} onClick={onClose}>
            Close
          </button>
        </header>

        <div className={styles.body}>
          <p className={styles.about}>
            Wildcard was designed and built by <strong>George Rodopoulos</strong>.{' '}
            <a href="https://github.com/GeorgeRodo" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </p>

          <h3 className={styles.subtitle}>Built with</h3>
          <ul className={styles.stack}>
            {TECH_STACK.map((tool) => (
              <li key={tool} className={styles.chip}>
                {tool}
              </li>
            ))}
          </ul>

          <h3 className={styles.subtitle}>Data and sound</h3>
          <p>
            Species, photos and sighting counts in the shuffle come from{' '}
            <a href="https://www.inaturalist.org" target="_blank" rel="noreferrer">
              iNaturalist
            </a>
            , and each photographer is credited on the card. Summaries are from Wikipedia.
          </p>
          <p>Sound effects are synthesised in the browser with the Web Audio API.</p>

          <h3 className={styles.subtitle}>Wall photos</h3>
          <p className={styles.note}>
            From Wikimedia Commons, resized and converted to WebP.
          </p>

          <ul className={styles.list}>
            {photoCredits.map((credit) => (
              <li key={credit.animal} className={styles.row}>
                <span className={styles.animal}>{credit.animal}</span>
                <span className={styles.photographer}>{credit.photographer}</span>
                <a
                  className={styles.licence}
                  href={credit.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  {credit.licence}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Modal>
  )
}
