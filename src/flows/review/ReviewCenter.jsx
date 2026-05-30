import { CheckCircle2, AlertCircle, MessageSquare, ListChecks } from 'lucide-react'
import VersionTimeline from './VersionTimeline'
import Button from '../../components/Button'
import Spinner from '../../components/Spinner'
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
  approval = 'idle',
  onApprove,
  onRequestChange,
  onComment,
}) {
  const submitting = approval === 'submitting'
  const approved = approval === 'approved'

  return (
    <section className={styles.center}>
      <div className={styles.timelineWrap}>
        <VersionTimeline versions={versions} approved={approved} />
      </div>

      <div className={styles.thumbsWrap}>
        <div className={styles.thumbs}>
          {screens.map((s) => (
            <ScreenThumb key={s.id} label={s.label} approved={approved} />
          ))}
        </div>

        {submitting && (
          <div className={styles.overlay}>
            <Spinner tone="green" size={34} />
            <span className={styles.overlayTitle}>Submitting Approval…</span>
            <span className={styles.overlaySub}>
              Notifying {meta.collaborators} collaborators
            </span>
          </div>
        )}
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
          icon={approved ? CheckCircle2 : undefined}
          className={styles.action}
          onClick={onApprove}
          disabled={submitting || approved}
        >
          {submitting ? (
            <span className={styles.loadingLabel}>
              <Spinner tone="white" size={15} /> Approving…
            </span>
          ) : approved ? (
            'Approved!'
          ) : (
            'Approve'
          )}
        </Button>
        <Button
          variant="dangerOutline"
          icon={AlertCircle}
          className={styles.action}
          onClick={onRequestChange}
          disabled={submitting || approved}
        >
          Request Change
        </Button>
        <Button
          variant="ghost"
          icon={MessageSquare}
          className={styles.action}
          onClick={onComment}
          disabled={submitting || approved}
        >
          Comment
        </Button>
      </div>
    </section>
  )
}
