import { CheckCircle2, Undo2 } from 'lucide-react'
import styles from './UndoToast.module.css'

const TOTAL = 5

/**
 * change: the change whose note was just sent
 * secondsLeft: countdown remaining
 * onUndo: revert the send
 */
export default function UndoToast({ change, secondsLeft, onUndo }) {
  return (
    <div className={styles.toast} role="status">
      <CheckCircle2 size={17} strokeWidth={2.5} className={styles.icon} />
      <span className={styles.text}>
        Intent note sent
        {change ? <span className={styles.sub}> · {change.componentName}</span> : null}
      </span>
      <button className={styles.undo} onClick={onUndo}>
        <Undo2 size={15} strokeWidth={2.5} /> Undo
      </button>
      <span className={styles.count}>{secondsLeft}s</span>
      <span className={styles.bar}>
        <span
          className={styles.fill}
          style={{ width: `${(secondsLeft / TOTAL) * 100}%` }}
        />
      </span>
    </div>
  )
}
