import styles from './Avatar.module.css'

/**
 * user: { initials, color }
 * size: number (px, default 28)
 */
export default function Avatar({ user, size = 28, className = '' }) {
  return (
    <span
      className={`${styles.avatar} ${className}`}
      style={{
        width: size,
        height: size,
        background: user.color,
        fontSize: Math.round(size * 0.4),
      }}
      title={user.name}
      aria-label={user.name}
    >
      {user.initials}
    </span>
  )
}

export function AvatarStack({ users, size = 28 }) {
  return (
    <span className={styles.stack}>
      {users.map((u) => (
        <Avatar key={u.id} user={u} size={size} className={styles.stacked} />
      ))}
    </span>
  )
}
