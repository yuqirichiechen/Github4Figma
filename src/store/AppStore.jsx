import { createContext, useContext, useMemo, useState } from 'react'
import { changes as seedChanges } from '../data/changes'
import { seedReviewNotes, reviewMeta } from '../data/reviewNotes'
import { users } from '../data/users'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [changes, setChanges] = useState(seedChanges)
  const [reviewNotes, setReviewNotes] = useState(seedReviewNotes)
  const [approval, setApproval] = useState('idle') // 'idle' | 'submitting' | 'approved'

  // Attach an intent note to a change AND surface it in the review panel.
  function sendIntentNote(changeId, { durationSec }) {
    const change = changes.find((c) => c.id === changeId)
    if (!change) return

    setChanges((prev) =>
      prev.map((c) =>
        c.id === changeId
          ? {
              id: c.id,
              ...c,
              intentNote: {
                id: `intent-${changeId}`,
                authorId: c.authorId,
                durationSec,
                status: 'sent',
                aiSummary: c.seededSummary,
              },
            }
          : c
      )
    )

    setReviewNotes((prev) => [
      {
        id: `note-${changeId}`,
        authorId: change.authorId,
        time: 'just now',
        text: change.seededSummary,
        tag: 'Intent Captured',
        status: 'open',
      },
      ...prev.filter((n) => n.id !== `note-${changeId}`),
    ])
  }

  function discardIntentNote(changeId) {
    setChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, intentNote: null } : c))
    )
  }

  function resolveAllNotes() {
    setReviewNotes((prev) => prev.map((n) => ({ ...n, status: 'resolved' })))
  }

  function approveDesign() {
    setApproval('submitting')
  }

  function finishApproval() {
    setApproval('approved')
    resolveAllNotes()
  }

  function resetApproval() {
    setApproval('idle')
  }

  const value = useMemo(
    () => ({
      users,
      changes,
      reviewNotes,
      reviewMeta,
      approval,
      sendIntentNote,
      discardIntentNote,
      approveDesign,
      finishApproval,
      resetApproval,
    }),
    [changes, reviewNotes, approval]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useStore must be used within <AppProvider>')
  return ctx
}
