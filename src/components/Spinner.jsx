import styles from './Spinner.module.css'

/**
 * tone: 'green' | 'indigo' | 'white' (default 'green')
 * size: number in px (default 22)
 */
export default function Spinner({ tone = 'green', size = 22, className = '' }) {
  return (
    <span
      className={`${styles.spinner} ${styles[tone]} ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  )
}
