import styles from './Waveform.module.css'

// Deterministic bar pattern so the waveform looks intentional, not random.
const BARS = [
  0.3, 0.55, 0.4, 0.8, 0.6, 0.95, 0.7, 0.45, 0.85, 0.5, 0.65, 0.35, 0.75, 0.9,
  0.55, 0.4, 0.7, 0.5, 0.85, 0.6, 0.3, 0.65, 0.45, 0.8, 0.5, 0.7, 0.4, 0.6,
]

/**
 * tone: 'indigo' | 'red'  (default 'indigo')
 * animated: enable the live "recording" motion (wired in Sprint 2)
 */
export default function Waveform({ tone = 'indigo', animated = false, className = '' }) {
  return (
    <div
      className={`${styles.wave} ${styles[tone]} ${animated ? styles.animated : ''} ${className}`}
      aria-hidden="true"
    >
      {BARS.map((h, i) => (
        <span
          key={i}
          className={styles.bar}
          style={{ height: `${Math.round(18 + h * 82)}%`, '--i': i }}
        />
      ))}
    </div>
  )
}
