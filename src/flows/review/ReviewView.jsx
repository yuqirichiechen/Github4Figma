import { useState } from 'react'
import { useStore } from '../../store/AppStore'
import { files } from '../../data/files'
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
    notesByFile,
    fileApproval,
    approveFile,
    finishApproveFile,
    addReviewNote,
    addReply,
  } = useStore()
  const [selectedFile, setSelectedFile] = useState(files[0].id)
  const [selectedVersion, setSelectedVersion] = useState('current')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [composer, setComposer] = useState(null) // 'comment' | 'request' | null

  const file = files.find((f) => f.id === selectedFile)
  const notes = notesByFile[selectedFile]
  const fileStatus = fileApproval[selectedFile] // 'reviewing' | 'submitting' | 'approved'
  const fileApproved = fileStatus === 'approved'
  const versionInfo = file.versions.find((v) => v.id === selectedVersion)

  const meta = {
    resolvedCount: notes.filter((n) => n.status === 'resolved').length,
    needsAttention: notes.filter(
      (n) => n.tag === 'Needs Attention' && n.status === 'open'
    ).length,
    collaborators: 3,
  }

  function selectFile(id) {
    setSelectedFile(id)
    setSelectedVersion('current') // always land on the live version
  }

  function confirmApprove() {
    setDialogOpen(false)
    approveFile(selectedFile) // -> this file 'submitting'
    setTimeout(() => finishApproveFile(selectedFile), 1600) // -> 'approved' + resolve its notes
  }

  return (
    <div className={styles.view}>
      <FilesPanel
        files={files}
        fileApproval={fileApproval}
        selectedId={selectedFile}
        onSelect={selectFile}
      />
      <ReviewCenter
        versions={file.versions}
        selectedVersion={selectedVersion}
        onSelectVersion={setSelectedVersion}
        versionInfo={versionInfo}
        users={users}
        screens={file.screens}
        meta={meta}
        status={fileStatus}
        fileName={file.name}
        onApprove={() => setDialogOpen(true)}
        onRequestChange={() => setComposer('request')}
        onComment={() => setComposer('comment')}
      />
      <ReviewDetails
        notes={notes}
        users={users}
        currentUser={currentUser}
        onAddReply={(noteId, payload) => addReply(selectedFile, noteId, payload)}
        approved={fileApproved}
      />

      <ApproveDialog
        open={dialogOpen}
        fileName={file.name}
        onCancel={() => setDialogOpen(false)}
        onConfirm={confirmApprove}
      />
      <ReviewComposer
        kind={composer}
        open={composer !== null}
        onClose={() => setComposer(null)}
        onSubmit={(payload) => addReviewNote(selectedFile, payload)}
      />
    </div>
  )
}
