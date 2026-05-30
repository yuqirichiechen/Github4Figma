import { useEffect, useState } from 'react'
import { useStore } from '../../store/AppStore'
import ChangedList from './ChangedList'
import ComponentDetail from './ComponentDetail'
import styles from './ChangesView.module.css'

export default function ChangesView() {
  const { changes, users, sendIntentNote, discardIntentNote } = useStore()
  const [selectedId, setSelectedId] = useState(changes[0].id)

  // Transient interaction state per change ('empty' | 'ready' | 'recording' | 'playback').
  // The 'sent' state is sourced from the store once a note is attached.
  const [stateById, setStateById] = useState({})
  const [durationById, setDurationById] = useState({})
  const [recSeconds, setRecSeconds] = useState(0)

  const selected = changes.find((c) => c.id === selectedId)
  const isSent = selected.intentNote?.status === 'sent'
  const transient = stateById[selectedId] ?? 'empty'
  const intentState = isSent ? 'sent' : transient

  const duration = isSent
    ? selected.intentNote.durationSec
    : durationById[selectedId] ?? 0

  // Live recording timer.
  useEffect(() => {
    if (intentState !== 'recording') return
    const id = setInterval(() => setRecSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [intentState, selectedId])

  function setTransient(next) {
    setStateById((prev) => ({ ...prev, [selectedId]: next }))
  }

  function handleIntentChange(next) {
    if (next === 'recording') setRecSeconds(0)
    if (next === 'playback') {
      setDurationById((prev) => ({ ...prev, [selectedId]: recSeconds }))
    }
    if (next === 'empty') {
      setDurationById((prev) => ({ ...prev, [selectedId]: 0 }))
      discardIntentNote(selectedId)
    }
    setTransient(next)
  }

  function handleSend() {
    const durationSec = durationById[selectedId] ?? recSeconds
    sendIntentNote(selectedId, { durationSec })
    // Clear transient so the store-derived 'sent' state takes over cleanly.
    setStateById((prev) => {
      const next = { ...prev }
      delete next[selectedId]
      return next
    })
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
        seconds={recSeconds}
        duration={duration}
        onIntentChange={handleIntentChange}
        onSend={handleSend}
      />
    </div>
  )
}
