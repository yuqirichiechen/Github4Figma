import { NavLink, useNavigate } from 'react-router-dom'
import { GitBranch, Share2, ChevronRight, PenLine, MessagesSquare } from 'lucide-react'
import Button from '../components/Button'
import { useStore } from '../store/AppStore'
import AccountSwitcher from './AccountSwitcher'
import styles from './TopBar.module.css'

const crumbs = ['GitHub for Figma', 'Mobile App Redesign', 'Review Session']

export default function TopBar() {
  const navigate = useNavigate()
  const { accounts, users, currentUserId, switchUser, reviewNotes } = useStore()

  const current = accounts.find((a) => a.id === currentUserId)
  const other = accounts.find((a) => a.id !== currentUserId)

  const openCount = reviewNotes.filter((n) => n.status === 'open').length
  const showBadge = openCount > 0

  function handleSwitch(id) {
    switchUser(id)
    const acc = accounts.find((a) => a.id === id)
    if (acc) navigate(acc.home)
  }

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.logo}>
          <GitBranch size={18} strokeWidth={2.5} />
        </span>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c} className={styles.crumb}>
              {i > 0 && <ChevronRight size={14} className={styles.sep} />}
              <span className={i === crumbs.length - 1 ? styles.crumbActive : ''}>
                {c}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <nav className={styles.tabs} aria-label="Flows">
        <NavLink
          to="/changes"
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
        >
          <PenLine size={15} strokeWidth={2.5} />
          Changes
        </NavLink>
        <NavLink
          to="/review"
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
        >
          <MessagesSquare size={15} strokeWidth={2.5} />
          Review
          {showBadge && <span className={styles.count}>{openCount}</span>}
        </NavLink>
      </nav>

      <div className={styles.right}>
        <AccountSwitcher
          current={current}
          other={other}
          users={users}
          onSwitch={handleSwitch}
        />
        <Button variant="ghost" size="sm" icon={Share2}>
          Share
        </Button>
      </div>
    </header>
  )
}
