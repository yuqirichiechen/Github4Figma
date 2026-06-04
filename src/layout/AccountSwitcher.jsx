import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import Avatar from '../components/Avatar'
import styles from './AccountSwitcher.module.css'

/**
 * current/other: { id, role, home } account objects
 * users: users map
 * onSwitch(id): swap account (caller also navigates)
 */
export default function AccountSwitcher({ current, other, users, onSwitch }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [open])

  const currentUser = users[current.id]

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar user={currentUser} size={24} />
        <span className={styles.label}>
          <span className={styles.name}>{currentUser.name}</span>
          <span className={styles.role}>{current.role}</span>
        </span>
        <ChevronDown size={15} strokeWidth={2.5} className={styles.chevron} />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <span className={styles.menuHead}>Switch account</span>
          <AccountRow account={current} users={users} active onClick={() => setOpen(false)} />
          <AccountRow
            account={other}
            users={users}
            onClick={() => {
              onSwitch(other.id)
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

function AccountRow({ account, users, active = false, onClick }) {
  const u = users[account.id]
  return (
    <button
      className={`${styles.row} ${active ? styles.activeRow : ''}`}
      onClick={onClick}
      role="menuitem"
    >
      <Avatar user={u} size={28} />
      <span className={styles.label}>
        <span className={styles.name}>{u.name}</span>
        <span className={styles.role}>{account.role}</span>
      </span>
      {active && <Check size={15} strokeWidth={2.5} className={styles.check} />}
    </button>
  )
}
