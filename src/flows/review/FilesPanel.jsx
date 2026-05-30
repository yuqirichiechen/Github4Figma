import { FileText, Plus, CheckCircle2 } from 'lucide-react'
import styles from './FilesPanel.module.css'

export default function FilesPanel({ files, selectedId, onSelect, approved = false }) {
  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Files</span>
        <button className={styles.add} aria-label="Add file">
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>

      <ul className={styles.list}>
        {files.map((f) => {
          const selected = f.id === selectedId
          return (
            <li key={f.id}>
              <button
                className={`${styles.item} ${selected ? styles.selected : ''}`}
                onClick={() => onSelect(f.id)}
                aria-current={selected ? 'true' : undefined}
              >
                <span className={styles.icon}>
                  {approved && selected ? (
                    <CheckCircle2 size={18} strokeWidth={2} className={styles.check} />
                  ) : (
                    <FileText size={18} strokeWidth={2} />
                  )}
                </span>
                <span className={styles.text}>
                  <span className={styles.name}>{f.name}</span>
                  <span className={styles.meta}>
                    {f.version}
                    {f.meta ? ` · ${f.meta}` : ''}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
