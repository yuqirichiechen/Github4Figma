import { CheckCircle2, AlertCircle, MessageSquare, ListChecks } from 'lucide-react'
import VersionTimeline from './VersionTimeline'
import Button from '../../components/Button'
import styles from './ReviewCenter.module.css'

function ScreenThumb({ label, approved }) {
  return (
    <div className={styles.thumb}>
      <div className={`${styles.phone} ${approved ? styles.phoneDone : ''}`}>
        {approved ? (
          <CheckCircle2 size={26} strokeWidth={2} className={styles.thumbCheck} />
        ) : (
          <div className={styles.skeleton}>
            <span style={{ width: '70%' }} />
            <span style={{ width: '90%' }} />
            <span style={{ width: '55%' }} />
            <span style={{ width: '80%' }} />
          </div>
        )}
      </div>
      <span className={styles.thumbLabel}>{label}</span>
    </div>
  )
}

export default function ReviewCenter({
  versions,
  screens,
  meta,
  approved = false,
  onApprove,
}) {
  return (
    <section className={styles.center}>
      <div className={styles.timelineWrap}>
        <VersionTimeline versions={versions} approved={approved} />
      </div>

      <div className={styles.thumbs}>
        {screens.map((s) => (
          <ScreenThumb key={s.id} label={s.label} approved={approved} />
        ))}
      </div>

      <div className={`${styles.summary} ${approved ? styles.summaryDone : ''}`}>
        {approved ? (
          <>
            <CheckCircle2 size={16} strokeWidth={2.5} />
            <span>Design approved by you · all intent notes resolved.</span>
          </>
        ) : (
          <>
            <ListChecks size={16} strokeWidth={2.5} />
            <span>
              All intent notes reviewed. {meta.resolvedCount} resolved,{' '}
              {meta.needsAttention} needs attention.
            </span>
          </>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          variant="success"
          icon={CheckCircle2}
          className={styles.action}
          onClick={onApprove}
          disabled={approved}
        >
          {approved ? 'Approved!' : 'Approve'}
        </Button>
        <Button variant="dangerOutline" icon={AlertCircle} className={styles.action} disabled={approved}>
          Request Change
        </Button>
        <Button variant="ghost" icon={MessageSquare} className={styles.action} disabled={approved}>
          Comment
        </Button>
      </div>
    </section>
  )
}
