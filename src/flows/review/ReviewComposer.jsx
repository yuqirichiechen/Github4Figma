import { useEffect, useState } from 'react'
import { MessageSquare, AlertCircle, X } from 'lucide-react'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import styles from './ReviewComposer.module.css'

// kind: 'comment' | 'request'
const CONFIG = {
  comment: {
    icon: MessageSquare,
    tone: 'indigo',
    title: 'Add a comment',
    placeholder: 'Share feedback with the team…',
    submitLabel: 'Post comment',
    tag: 'Intent Captured',
    variant: 'primary',
  },
  request: {
    icon: AlertCircle,
    tone: 'red',
    title: 'Request a change',
    placeholder: 'Describe what needs to change…',
    submitLabel: 'Request change',
    tag: 'Needs Attention',
    variant: 'dangerOutline',
  },
}

export default function ReviewComposer({ kind, open, onClose, onSubmit }) {
  const [text, setText] = useState('')
  const cfg = CONFIG[kind] ?? CONFIG.comment
  const Icon = cfg.icon

  useEffect(() => {
    if (open) setText('')
  }, [open, kind])

  function handleSubmit() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit({ text: trimmed, tag: cfg.tag })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="composer-title">
      <div className={styles.body}>
        <div className={styles.top}>
          <span className={`${styles.icon} ${styles[cfg.tone]}`}>
            <Icon size={20} strokeWidth={2} />
          </span>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <h3 id="composer-title" className={styles.title}>
          {cfg.title}
        </h3>
        <textarea
          className={styles.textarea}
          placeholder={cfg.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          autoFocus
        />

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={cfg.variant} icon={Icon} onClick={handleSubmit} disabled={!text.trim()}>
            {cfg.submitLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
