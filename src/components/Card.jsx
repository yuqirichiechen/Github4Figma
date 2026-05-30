import styles from './Card.module.css'

/**
 * padding: 'none' | 'sm' | 'md' (default 'md')
 * variant: 'default' | 'subtle' | 'dashed' (default 'default')
 */
export default function Card({
  padding = 'md',
  variant = 'default',
  className = '',
  children,
  ...rest
}) {
  return (
    <div
      className={`${styles.card} ${styles[variant]} ${styles[`p-${padding}`]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
