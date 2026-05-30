import { useState } from 'react'
import { useStore } from '../../store/AppStore'
import ChangedList from './ChangedList'
import ComponentDetail from './ComponentDetail'
import styles from './ChangesView.module.css'

export default function ChangesView() {
  const { changes, users } = useStore()
  const [selectedId, setSelectedId] = useState(changes[0].id)
  // Each change tracks its own intent-note state (Sprint 1: manual click-through).
  const [stateById, setStateById] = useState({})

  const selected = changes.find((c) => c.id === selectedId)
  const intentState = stateById[selectedId] ?? 'empty'

  function setIntentState(next) {
    setStateById((prev) => ({ ...prev, [selectedId]: next }))
  }

  return (
    <div className={styles.view}>
      <ChangedList
        changes={changes}
        users={users}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ComponentDetail
        change={selected}
        author={users[selected.authorId]}
        intentState={intentState}
        onIntentChange={setIntentState}
      />
    </div>
  )
}
