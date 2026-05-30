import styles from './Placeholder.module.css'

export default function Placeholder({ icon: Icon, title, sprint, children }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        {Icon && (
          <span className={styles.icon}>
            <Icon size={28} strokeWidth={2} />
          </span>
        )}
        <h2 className={styles.title}>{title}</h2>
        {sprint && <span className={styles.sprint}>{sprint}</span>}
        {children && <p className={styles.body}>{children}</p>}
      </div>
    </div>
  )
}
