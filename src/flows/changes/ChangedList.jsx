import { History } from 'lucide-react'
import styles from './ChangedList.module.css'

export default function ChangedList({ changes, users, selectedId, onSelect }) {
  return (
    <aside className={styles.list}>
      <div className={styles.header}>Changed</div>
      <ul className={styles.items}>
        {changes.map((c) => {
          const author = users[c.authorId]
          const selected = c.id === selectedId
          return (
            <li key={c.id}>
              <button
                className={`${styles.item} ${selected ? styles.selected : ''}`}
                onClick={() => onSelect(c.id)}
                aria-current={selected ? 'true' : undefined}
              >
                <span className={styles.dot} style={{ background: author.color }} />
                <span className={styles.text}>
                  <span className={styles.name}>{c.componentName}</span>
                  <span className={styles.meta}>
                    {author.name} · {c.updatedAt}
                  </span>
                </span>
                {selected && (
                  <span className={styles.badge}>
                    <History size={13} strokeWidth={2.5} />
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
