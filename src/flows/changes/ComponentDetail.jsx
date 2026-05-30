import IntentNote from './IntentNote'
import styles from './ComponentDetail.module.css'

export default function ComponentDetail({ change, author, intentState, onIntentChange }) {
  return (
    <section className={styles.detail}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>{change.componentName}</h2>
          <span className={styles.meta}>
            {author.name} · {change.updatedAt}
          </span>
        </header>

        <div className={styles.preview}>
          <span className={styles.previewLabel}>{change.previewLabel}</span>
        </div>

        <IntentNote
          state={intentState}
          summary={change.seededSummary}
          onChange={onIntentChange}
        />
      </div>
    </section>
  )
}
