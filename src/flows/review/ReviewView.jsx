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
    fileApproval,
    sessionApproved,
    approveFile,
    finishApproveFile,
    addReviewNote,
    addReply,
  } = useStore()
  const [selectedFile, setSelectedFile] = useState(files[0].id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [composer, setComposer] = useState(null) // 'comment' | 'request' | null

  const selected = files.find((f) => f.id === selectedFile)
  const selectedStatus = fileApproval[selectedFile] // 'reviewing' | 'submitting' | 'approved'

  function confirmApprove() {
    setDialogOpen(false)
    approveFile(selectedFile) // -> this file 'submitting'
    setTimeout(() => finishApproveFile(selectedFile), 1600) // -> this file 'approved'
  }

  return (
    <div className={styles.view}>
      <FilesPanel
        files={files}
        fileApproval={fileApproval}
        selectedId={selectedFile}
        onSelect={setSelectedFile}
      />
      <ReviewCenter
        versions={versions}
        screens={screens}
        meta={reviewMeta}
        status={selectedStatus}
        fileName={selected.name}
        onApprove={() => setDialogOpen(true)}
        onRequestChange={() => setComposer('request')}
        onComment={() => setComposer('comment')}
      />
      <ReviewDetails
        notes={reviewNotes}
        users={users}
        currentUser={currentUser}
        onAddReply={addReply}
        approved={sessionApproved}
      />

      <ApproveDialog
        open={dialogOpen}
        fileName={selected.name}
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
