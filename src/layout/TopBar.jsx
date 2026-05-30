import { NavLink } from 'react-router-dom'
import { GitBranch, Share2, ChevronRight } from 'lucide-react'
import { AvatarStack } from '../components/Avatar'
import Button from '../components/Button'
import { collaborators } from '../data/users'
import styles from './TopBar.module.css'

const crumbs = ['GitHub for Figma', 'Mobile App Redesign', 'Review Session']

export default function TopBar() {
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
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.tabActive : ''}`
          }
        >
          Changes
        </NavLink>
        <NavLink
          to="/review"
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.tabActive : ''}`
          }
        >
          Review
        </NavLink>
      </nav>

      <div className={styles.right}>
        <AvatarStack users={collaborators} size={26} />
        <Button variant="ghost" size="sm" icon={Share2}>
          Share
        </Button>
      </div>
    </header>
  )
}
