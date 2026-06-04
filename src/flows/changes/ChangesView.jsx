import { useEffect, useState } from 'react'
import { useStore } from '../../store/AppStore'
import ChangedList from './ChangedList'
import ComponentDetail from './ComponentDetail'
import UndoToast from './UndoToast'
import styles from './ChangesView.module.css'

const UNDO_SECONDS = 5

export default function ChangesView() {
  const { changes, users, sendIntentNote, undoSend, discardIntentNote } = useStore()
  const [selectedId, setSelectedId] = useState(changes[0].id)

  // Transient interaction state per change ('empty' | 'ready' | 'recording' | 'playback').
  // The 'sent' state is sourced from the store once a note is attached.
  const [stateById, setStateById] = useState({})
  const [durationById, setDurationById] = useState({})
  const [recSeconds, setRecSeconds] = useState(0)
  const [undo, setUndo] = useState(null) // { changeId, secondsLeft }

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

  // Undo countdown — toast disappears (commits) at 0.
  useEffect(() => {
    if (!undo) return
    if (undo.secondsLeft <= 0) {
      setUndo(null)
      return
    }
    const t = setTimeout(
      () => setUndo((u) => (u ? { ...u, secondsLeft: u.secondsLeft - 1 } : u)),
      1000
    )
    return () => clearTimeout(t)
  }, [undo])

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
    const sentId = selectedId
    const durationSec = durationById[sentId] ?? recSeconds
    sendIntentNote(sentId, { durationSec })
    // Clear transient so the store-derived 'sent' state takes over cleanly.
    setStateById((prev) => {
      const next = { ...prev }
      delete next[sentId]
      return next
    })
    // Keep the captured duration so Undo can restore the playback card.
    setDurationById((prev) => ({ ...prev, [sentId]: durationSec }))
    setUndo({ changeId: sentId, secondsLeft: UNDO_SECONDS })
  }

  function handleUndo() {
    if (!undo) return
    const id = undo.changeId
    undoSend(id)
    // Restore the playback card (duration is still in durationById).
    setStateById((prev) => ({ ...prev, [id]: 'playback' }))
    setUndo(null)
  }

  const undoChange = undo ? changes.find((c) => c.id === undo.changeId) : null

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

      {undo && (
        <UndoToast
          change={undoChange}
          secondsLeft={undo.secondsLeft}
          onUndo={handleUndo}
        />
      )}
    </div>
  )
}
