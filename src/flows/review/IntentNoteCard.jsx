import { useState } from 'react'
import { Circle, CheckCircle2, MessageSquare, ChevronDown, ChevronUp, Send, Check, Sparkles } from 'lucide-react'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import VoiceClip from '../../components/VoiceClip'
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
  readOnly = false,
}) {
  const resolved = note.status === 'resolved'
  const isNew = !resolved && note.time === 'just now'
  const replies = note.replies ?? []
  const locked = readOnly || approved

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

      {note.voice && (
        <div className={styles.voiceWrap}>
          <VoiceClip durationSec={note.voice.durationSec} />
        </div>
      )}

      {note.aiSummary && (
        <div className={styles.aiSummary}>
          <span className={styles.aiLabel}>
            <Sparkles size={12} strokeWidth={2.5} /> AI Summary
          </span>
          <p className={styles.aiText}>{note.aiSummary}</p>
        </div>
      )}

      {note.text && <p className={styles.text}>{note.text}</p>}

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

        {!resolved && !locked && (
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

          {!locked && (
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
