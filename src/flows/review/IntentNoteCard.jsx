import { Circle, CheckCircle2 } from 'lucide-react'
import Badge from '../../components/Badge'
import styles from './IntentNoteCard.module.css'

const TAG_TONE = {
  'Intent Captured': 'amber',
  'Needs Attention': 'red',
}

export default function IntentNoteCard({ note, author }) {
  const resolved = note.status === 'resolved'
  const isNew = !resolved && note.time === 'just now'
  return (
    <article
      className={`${styles.card} ${resolved ? styles.resolved : ''} ${
        isNew ? styles.fresh : ''
      }`}
    >
      <header className={styles.head}>
        <span className={styles.who}>
          {resolved ? (
            <CheckCircle2 size={15} strokeWidth={2.5} className={styles.tick} />
          ) : (
            <Circle size={15} strokeWidth={2} className={styles.radio} />
          )}
          <span className={styles.name}>{author.name}</span>
          <span className={styles.time}>{note.time}</span>
        </span>
        {resolved ? (
          <Badge tone="green" icon={CheckCircle2}>
            Resolved
          </Badge>
        ) : (
          <Badge tone={TAG_TONE[note.tag] ?? 'amber'}>{note.tag}</Badge>
        )}
      </header>
      <p className={styles.text}>{note.text}</p>
    </article>
  )
}
