import { CheckCircle2, X } from 'lucide-react'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import styles from './ApproveDialog.module.css'

export default function ApproveDialog({ open, onCancel, onConfirm }) {
  return (
    <Modal open={open} onClose={onCancel} labelledBy="approve-title">
      <div className={styles.body}>
        <div className={styles.top}>
          <span className={styles.icon}>
            <CheckCircle2 size={22} strokeWidth={2} />
          </span>
          <button className={styles.close} onClick={onCancel} aria-label="Close">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <h3 id="approve-title" className={styles.title}>
          Approve this design?
        </h3>
        <p className={styles.text}>
          You’re approving the <strong>Mobile App Redesign v3</strong> for
          production. This will notify all collaborators.
        </p>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="success" icon={CheckCircle2} onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  )
}
