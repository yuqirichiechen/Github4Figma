import { SlidersHorizontal, ChevronRight, CheckCircle2 } from 'lucide-react'
import IntentNoteCard from './IntentNoteCard'
import styles from './ReviewDetails.module.css'

export default function ReviewDetails({
  notes,
  users,
  currentUser,
  onAddReply,
  onResolve,
  approved = false,
  readOnly = false,
  versionLabel,
}) {
  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <span className={styles.title}>Review Details</span>
        <button className={styles.filter} aria-label="Filter">
          <SlidersHorizontal size={15} strokeWidth={2} />
        </button>
      </header>

      <div className={styles.sortRow}>
        {readOnly ? (
          <span className={styles.approvedTag}>
            <CheckCircle2 size={13} strokeWidth={2.5} /> {versionLabel} · approved
          </span>
        ) : (
          <button className={styles.sort}>
            Sort: Recent <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className={styles.notes}>
        {notes.length === 0 ? (
          <p className={styles.empty}>No comments on this version.</p>
        ) : (
          notes.map((n) => (
            <IntentNoteCard
              key={n.id}
              note={n}
              author={users[n.authorId]}
              users={users}
              currentUser={currentUser}
              onAddReply={onAddReply}
              onResolve={onResolve}
              approved={approved}
              readOnly={readOnly}
            />
          ))
        )}
      </div>
    </aside>
  )
}
