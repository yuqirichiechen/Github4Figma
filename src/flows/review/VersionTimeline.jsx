import { Check } from 'lucide-react'
import styles from './VersionTimeline.module.css'

/**
 * versions: [{ id, label, when, state: 'done' | 'active' }]
 * approved: when true, every node renders as a completed green check
 *
 * Default review: v1..v3 = indigo outline rings, Current = filled indigo.
 * Approved:       every node = filled green with a check.
 */
export default function VersionTimeline({ versions, approved = false }) {
  return (
    <ol className={styles.timeline}>
      {versions.map((v, i) => {
        const kind = approved ? 'approved' : v.state // 'approved' | 'done' | 'active'
        return (
          <li key={v.id} className={styles.node}>
            {i > 0 && (
              <span className={`${styles.line} ${approved ? styles.lineDone : ''}`} />
            )}
            <span className={`${styles.dot} ${styles[kind]}`}>
              {kind === 'approved' && <Check size={12} strokeWidth={3} />}
            </span>
            <span className={styles.label}>{v.label}</span>
            <span className={styles.when}>
              {approved && v.state === 'active' ? 'Approved ✓' : v.when}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
