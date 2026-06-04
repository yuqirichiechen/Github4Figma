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
    resolveNote,
  } = useStore()
  const [selectedFile, setSelectedFile] = useState(files[0].id)
  const [selectedVersion, setSelectedVersion] = useState('current')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [composer, setComposer] = useState(null) // 'comment' | 'request' | null
  const [triedApprove, setTriedApprove] = useState(false)

  const file = files.find((f) => f.id === selectedFile)
  const fileStatus = fileApproval[selectedFile] // 'reviewing' | 'submitting' | 'approved'
  const fileApproved = fileStatus === 'approved'
  const versionInfo = file.versions.find((v) => v.id === selectedVersion)
  const viewingPast = selectedVersion !== 'current'

  // Live (Current) notes drive approval/meta; the panel shows the selected version.
  const currentNotes = notesByFile[selectedFile]
  const displayedNotes = viewingPast
    ? file.notesByVersion[selectedVersion]
    : currentNotes

  const unresolvedIssues = currentNotes.filter(
    (n) => n.tag === 'Needs Attention' && n.status === 'open'
  ).length

  const meta = {
    resolvedCount: currentNotes.filter((n) => n.status === 'resolved').length,
    needsAttention: unresolvedIssues,
    collaborators: 3,
  }

  // Show the error only after a blocked approve attempt, and auto-clear once resolved.
  const approveError = triedApprove && unresolvedIssues > 0 ? unresolvedIssues : 0

  function selectFile(id) {
    setSelectedFile(id)
    setSelectedVersion('current') // always land on the live version
    setTriedApprove(false)
  }

  function handleApproveClick() {
    if (unresolvedIssues > 0) {
      setTriedApprove(true) // block + surface the error
      return
    }
    setTriedApprove(false)
    setDialogOpen(true)
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
        approveError={approveError}
        onApprove={handleApproveClick}
        onRequestChange={() => setComposer('request')}
        onComment={() => setComposer('comment')}
      />
      <ReviewDetails
        notes={displayedNotes}
        users={users}
        currentUser={currentUser}
        onAddReply={(noteId, payload) => addReply(selectedFile, noteId, payload)}
        onResolve={(noteId) => resolveNote(selectedFile, noteId)}
        approved={!viewingPast && fileApproved}
        readOnly={viewingPast}
        versionLabel={versionInfo.label}
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
