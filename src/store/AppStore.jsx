import { createContext, useContext, useMemo, useState } from 'react'
import { changes as seedChanges } from '../data/changes'
import { seedReviewNotes, reviewMeta } from '../data/reviewNotes'
import { users, accounts } from '../data/users'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [changes, setChanges] = useState(seedChanges)
  const [reviewNotes, setReviewNotes] = useState(seedReviewNotes)
  const [approval, setApproval] = useState('idle') // 'idle' | 'submitting' | 'approved'
  const [currentUserId, setCurrentUserId] = useState('richie')

  // Switch the active account (Designer / Reviewer). Navigation handled by caller.
  function switchUser(id) {
    setCurrentUserId(id)
  }

  // Attach an intent note to a change AND surface it in the review panel.
  function sendIntentNote(changeId, { durationSec }) {
    const change = changes.find((c) => c.id === changeId)
    if (!change) return

    setChanges((prev) =>
      prev.map((c) =>
        c.id === changeId
          ? {
              ...c,
              intentNote: {
                id: `intent-${changeId}`,
                authorId: currentUserId,
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
        authorId: currentUserId,
        time: 'just now',
        text: change.seededSummary,
        tag: 'Intent Captured',
        status: 'open',
        replies: [],
      },
      ...prev.filter((n) => n.id !== `note-${changeId}`),
    ])
  }

  // Remove a just-sent intent note (Gmail-style undo window).
  function undoSend(changeId) {
    setReviewNotes((prev) => prev.filter((n) => n.id !== `note-${changeId}`))
    setChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, intentNote: null } : c))
    )
  }

  // Add a reviewer note from the Comment / Request Change composer.
  function addReviewNote({ text, tag }) {
    setReviewNotes((prev) => [
      {
        id: `note-manual-${Date.now()}`,
        authorId: currentUserId,
        time: 'just now',
        text,
        tag,
        status: 'open',
        replies: [],
      },
      ...prev,
    ])
  }

  // Append a threaded reply to a review note, authored by the current user.
  function addReply(noteId, { text }) {
    setReviewNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? {
              ...n,
              replies: [
                ...(n.replies ?? []),
                {
                  id: `reply-${noteId}-${Date.now()}`,
                  authorId: currentUserId,
                  text,
                  time: 'just now',
                },
              ],
            }
          : n
      )
    )
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
      accounts,
      currentUserId,
      currentUser: users[currentUserId],
      changes,
      reviewNotes,
      reviewMeta,
      approval,
      switchUser,
      sendIntentNote,
      undoSend,
      discardIntentNote,
      addReviewNote,
      addReply,
      approveDesign,
      finishApproval,
      resetApproval,
    }),
    [changes, reviewNotes, approval, currentUserId]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useStore must be used within <AppProvider>')
  return ctx
}
