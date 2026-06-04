import { SlidersHorizontal, ChevronRight, CheckCircle2 } from 'lucide-react'
import IntentNoteCard from './IntentNoteCard'
import styles from './ReviewDetails.module.css'

export default function ReviewDetails({
  notes,
  users,
  currentUser,
  onAddReply,
  approved = false,
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
        {approved ? (
          <span className={styles.approvedTag}>
            <CheckCircle2 size={13} strokeWidth={2.5} /> Approved
          </span>
        ) : (
          <button className={styles.sort}>
            Sort: Recent <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className={styles.notes}>
        {notes.map((n) => (
          <IntentNoteCard
            key={n.id}
            note={n}
            author={users[n.authorId]}
            users={users}
            currentUser={currentUser}
            onAddReply={onAddReply}
            approved={approved}
          />
        ))}
      </div>
    </aside>
  )
}
