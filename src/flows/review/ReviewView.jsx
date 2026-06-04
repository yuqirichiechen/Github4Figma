import { useState } from 'react'
import { useStore } from '../../store/AppStore'
import { files, versions, screens } from '../../data/files'
import FilesPanel from './FilesPanel'
import ReviewCenter from './ReviewCenter'
import ReviewDetails from './ReviewDetails'
import ApproveDialog from './ApproveDialog'
import ReviewComposer from './ReviewComposer'
import styles from './ReviewView.module.css'

export default function ReviewView() {
  const {
    users,
    currentUser,
    reviewNotes,
    reviewMeta,
    approval,
    approveDesign,
    finishApproval,
    addReviewNote,
    addReply,
  } = useStore()
  const [selectedFile, setSelectedFile] = useState(files[0].id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [composer, setComposer] = useState(null) // 'comment' | 'request' | null

  const approved = approval === 'approved'

  function confirmApprove() {
    setDialogOpen(false)
    approveDesign() // -> 'submitting'
    setTimeout(finishApproval, 1600) // -> 'approved' + resolve notes
  }

  return (
    <div className={styles.view}>
      <FilesPanel
        files={files}
        selectedId={selectedFile}
        onSelect={setSelectedFile}
        approved={approved}
      />
      <ReviewCenter
        versions={versions}
        screens={screens}
        meta={reviewMeta}
        approval={approval}
        onApprove={() => setDialogOpen(true)}
        onRequestChange={() => setComposer('request')}
        onComment={() => setComposer('comment')}
      />
      <ReviewDetails
        notes={reviewNotes}
        users={users}
        currentUser={currentUser}
        onAddReply={addReply}
        approved={approved}
      />

      <ApproveDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={confirmApprove}
      />
      <ReviewComposer
        kind={composer}
        open={composer !== null}
        onClose={() => setComposer(null)}
        onSubmit={addReviewNote}
      />
    </div>
  )
}
