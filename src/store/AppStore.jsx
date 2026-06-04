import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { changes as seedChanges } from '../data/changes'
import { seedReviewNotes, reviewMeta } from '../data/reviewNotes'
import { users, accounts } from '../data/users'
import { files } from '../data/files'

const AppContext = createContext(null)

// Each file is reviewed and approved independently.
const initialFileApproval = Object.fromEntries(
  files.map((f) => [f.id, 'reviewing']) // 'reviewing' | 'submitting' | 'approved'
)

export function AppProvider({ children }) {
  const [changes, setChanges] = useState(seedChanges)
  const [reviewNotes, setReviewNotes] = useState(seedReviewNotes)
  const [fileApproval, setFileApproval] = useState(initialFileApproval)
  const [currentUserId, setCurrentUserId] = useState('richie')

  const sessionApproved = files.every((f) => fileApproval[f.id] === 'approved')

  // Resolve all intent notes only once the entire session is approved.
  useEffect(() => {
    if (!files.every((f) => fileApproval[f.id] === 'approved')) return
    setReviewNotes((prev) =>
      prev.every((n) => n.status === 'resolved')
        ? prev
        : prev.map((n) => ({ ...n, status: 'resolved' }))
    )
  }, [fileApproval])

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

  // Approve a single file (shows its spinner), then mark it approved.
  function approveFile(fileId) {
    setFileApproval((prev) => ({ ...prev, [fileId]: 'submitting' }))
  }

  function finishApproveFile(fileId) {
    setFileApproval((prev) => ({ ...prev, [fileId]: 'approved' }))
  }

  function resetApprovals() {
    setFileApproval(initialFileApproval)
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
      fileApproval,
      sessionApproved,
      switchUser,
      sendIntentNote,
      undoSend,
      discardIntentNote,
      addReviewNote,
      addReply,
      approveFile,
      finishApproveFile,
      resetApprovals,
    }),
    [changes, reviewNotes, fileApproval, sessionApproved, currentUserId]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useStore must be used within <AppProvider>')
  return ctx
}
