import { useState } from 'react'
import { useStore } from '../../store/AppStore'
import { files, versions, screens } from '../../data/files'
import FilesPanel from './FilesPanel'
import ReviewCenter from './ReviewCenter'
import ReviewDetails from './ReviewDetails'
import styles from './ReviewView.module.css'

export default function ReviewView() {
  const { users, reviewNotes, reviewMeta, approval } = useStore()
  const [selectedFile, setSelectedFile] = useState(files[0].id)

  const approved = approval === 'approved'

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
        approved={approved}
        onApprove={() => {}}
      />
      <ReviewDetails notes={reviewNotes} users={users} approved={approved} />
    </div>
  )
}
