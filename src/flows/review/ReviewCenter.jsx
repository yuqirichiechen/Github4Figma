import { CheckCircle2, AlertCircle, MessageSquare, ListChecks, Lock } from 'lucide-react'
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
  selectedVersion,
  onSelectVersion,
  versionInfo,
  users,
  screens,
  meta,
  status = 'reviewing',
  fileName,
  onApprove,
  onRequestChange,
  onComment,
}) {
  const viewingPast = selectedVersion !== 'current'
  const submitting = !viewingPast && status === 'submitting'
  const currentApproved = !viewingPast && status === 'approved'
  const thumbsApproved = viewingPast || currentApproved // past versions are historical, locked-in

  const approver = versionInfo?.by ? users[versionInfo.by] : null

  return (
    <section className={styles.center}>
      <div className={styles.timelineWrap}>
        <VersionTimeline
          versions={versions}
          selectedId={selectedVersion}
          currentStatus={status}
          onSelect={onSelectVersion}
        />
      </div>

      <div className={styles.thumbsWrap}>
        <div className={styles.thumbs}>
          {screens.map((s) => (
            <ScreenThumb key={s.id} label={s.label} approved={thumbsApproved} />
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

      {viewingPast ? (
        /* ---- historical version: read-only, already approved ---- */
        <>
          <div className={`${styles.summary} ${styles.summaryDone}`}>
            <CheckCircle2 size={16} strokeWidth={2.5} />
            <span>
              {versionInfo.label} approved
              {approver ? ` by ${approver.name}` : ''} · {versionInfo.when}
            </span>
          </div>
          <div className={styles.locked}>
            <Lock size={15} strokeWidth={2} />
            <span>
              This version is locked. Switch to <strong>Current</strong> to review and
              approve.
            </span>
          </div>
        </>
      ) : (
        /* ---- current version: live review ---- */
        <>
          <div className={`${styles.summary} ${currentApproved ? styles.summaryDone : ''}`}>
            {currentApproved ? (
              <>
                <CheckCircle2 size={16} strokeWidth={2.5} />
                <span>{fileName} · Current approved by you · collaborators notified.</span>
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
              icon={currentApproved ? CheckCircle2 : undefined}
              className={styles.action}
              onClick={onApprove}
              disabled={submitting || currentApproved}
            >
              {submitting ? (
                <span className={styles.loadingLabel}>
                  <Spinner tone="white" size={15} /> Approving…
                </span>
              ) : currentApproved ? (
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
              disabled={submitting || currentApproved}
            >
              Request Change
            </Button>
            <Button
              variant="ghost"
              icon={MessageSquare}
              className={styles.action}
              onClick={onComment}
              disabled={submitting || currentApproved}
            >
              Comment
            </Button>
          </div>
        </>
      )}
    </section>
  )
}
