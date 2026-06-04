import { Check } from 'lucide-react'
import styles from './VersionTimeline.module.css'

/**
 * versions: [{ id, label, when, state: 'approved' | 'active', by? }]
 * selectedId: the version currently being viewed
 * currentStatus: live status of the 'current' node ('reviewing' | 'submitting' | 'approved')
 * onSelect(id): view a version
 *
 * v1–v3 are historical (approved). 'Current' is live: indigo while reviewing,
 * green once approved.
 */
export default function VersionTimeline({ versions, selectedId, currentStatus, onSelect }) {
  return (
    <ol className={styles.timeline}>
      {versions.map((v, i) => {
        const isCurrent = v.id === 'current'
        const approved = isCurrent ? currentStatus === 'approved' : v.state === 'approved'
        const active = isCurrent && !approved
        const kind = approved ? 'approved' : active ? 'active' : 'done'
        const selected = v.id === selectedId
        const prevApproved = i > 0 && versions[i - 1].state === 'approved'

        return (
          <li key={v.id} className={styles.node}>
            {i > 0 && (
              <span className={`${styles.line} ${prevApproved ? styles.lineDone : ''}`} />
            )}
            <button
              type="button"
              className={`${styles.dot} ${styles[kind]} ${selected ? styles.selected : ''}`}
              onClick={() => onSelect(v.id)}
              aria-current={selected ? 'true' : undefined}
              aria-label={`View ${v.label}`}
            >
              {approved && <Check size={12} strokeWidth={3} />}
            </button>
            <span className={`${styles.label} ${selected ? styles.labelSelected : ''}`}>
              {v.label}
            </span>
            <span className={styles.when}>
              {isCurrent && approved ? 'Approved ✓' : v.when}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
