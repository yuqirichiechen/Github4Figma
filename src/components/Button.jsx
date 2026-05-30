import styles from './Button.module.css'

/**
 * variant: 'primary' | 'danger' | 'success' | 'ghost'  (default 'ghost')
 * size:    'sm' | 'md'                                  (default 'md')
 */
export default function Button({
  variant = 'ghost',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  ...rest
}) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={16} strokeWidth={2} aria-hidden="true" />}
      {children && <span>{children}</span>}
    </button>
  )
}
