import { useState } from 'react'
import { Circle, CheckCircle2, MessageSquare, ChevronDown, ChevronUp, Send, Check } from 'lucide-react'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import styles from './IntentNoteCard.module.css'

const TAG_TONE = {
  'Intent Captured': 'amber',
  'Needs Attention': 'red',
}

export default function IntentNoteCard({
  note,
  author,
  users,
  currentUser,
  onAddReply,
  onResolve,
  approved = false,
}) {
  const resolved = note.status === 'resolved'
  const isNew = !resolved && note.time === 'just now'
  const replies = note.replies ?? []

  const [expanded, setExpanded] = useState(false)
  const [replyText, setReplyText] = useState('')

  function submitReply() {
    const trimmed = replyText.trim()
    if (!trimmed) return
    onAddReply(note.id, { text: trimmed })
    setReplyText('')
  }

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

      <div className={styles.cardActions}>
        <button
          className={styles.threadToggle}
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <MessageSquare size={13} strokeWidth={2.5} />
          {replies.length > 0 ? `${replies.length} repl${replies.length === 1 ? 'y' : 'ies'}` : 'Reply'}
          {expanded ? (
            <ChevronUp size={13} strokeWidth={2.5} />
          ) : (
            <ChevronDown size={13} strokeWidth={2.5} />
          )}
        </button>

        {!resolved && (
          <button className={styles.resolveBtn} onClick={() => onResolve(note.id)}>
            <Check size={13} strokeWidth={2.5} /> Resolve
          </button>
        )}
      </div>

      {expanded && (
        <div className={styles.thread}>
          {replies.map((r) => {
            const ru = users[r.authorId]
            return (
              <div key={r.id} className={styles.reply}>
                <Avatar user={ru} size={20} />
                <div className={styles.replyBody}>
                  <span className={styles.replyMeta}>
                    <span className={styles.replyName}>{ru.name}</span>
                    <span className={styles.replyTime}>{r.time}</span>
                  </span>
                  <p className={styles.replyText}>{r.text}</p>
                </div>
              </div>
            )
          })}

          {!approved && (
            <div className={styles.replyForm}>
              <Avatar user={currentUser} size={22} />
              <input
                className={styles.replyInput}
                placeholder="Write a reply…"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    submitReply()
                  }
                }}
              />
              <Button
                variant="primary"
                size="sm"
                icon={Send}
                onClick={submitReply}
                disabled={!replyText.trim()}
              />
            </div>
          )}
        </div>
      )}
    </article>
  )
}
