import styles from './Badge.module.css'

/**
 * tone: 'neutral' | 'indigo' | 'amber' | 'green' | 'red' (default 'neutral')
 */
export default function Badge({
  tone = 'neutral',
  icon: Icon,
  children,
  className = '',
}) {
  return (
    <span className={`${styles.badge} ${styles[tone]} ${className}`}>
      {Icon && <Icon size={12} strokeWidth={2.5} aria-hidden="true" />}
      {children}
    </span>
  )
}
