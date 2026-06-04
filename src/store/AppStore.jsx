import { createContext, useContext, useMemo, useState } from 'react'
import { changes as seedChanges } from '../data/changes'
import { users, accounts } from '../data/users'
import { files } from '../data/files'

const AppContext = createContext(null)

// Each file is reviewed and approved independently.
const initialFileApproval = Object.fromEntries(
  files.map((f) => [f.id, 'reviewing']) // 'reviewing' | 'submitting' | 'approved'
)

// Notes live per file: { [fileId]: [note, ...] }.
const initialNotesByFile = Object.fromEntries(files.map((f) => [f.id, f.notes]))

export function AppProvider({ children }) {
  const [changes, setChanges] = useState(seedChanges)
  const [notesByFile, setNotesByFile] = useState(initialNotesByFile)
  const [fileApproval, setFileApproval] = useState(initialFileApproval)
  const [currentUserId, setCurrentUserId] = useState('richie')

  const sessionApproved = files.every((f) => fileApproval[f.id] === 'approved')
  const openNoteCount = Object.values(notesByFile).reduce(
    (sum, list) => sum + list.filter((n) => n.status === 'open').length,
    0
  )

  // Switch the active account (Designer / Reviewer). Navigation handled by caller.
  function switchUser(id) {
    setCurrentUserId(id)
  }

  // Attach an intent note to a change AND surface it under that change's review file.
  function sendIntentNote(changeId, { durationSec }) {
    const change = changes.find((c) => c.id === changeId)
    if (!change) return
    const fileId = change.reviewFileId

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

    setNotesByFile((prev) => ({
      ...prev,
      [fileId]: [
        {
          id: `note-${changeId}`,
          authorId: currentUserId,
          time: 'just now',
          text: change.seededSummary,
          tag: 'Intent Captured',
          status: 'open',
          replies: [],
        },
        ...prev[fileId].filter((n) => n.id !== `note-${changeId}`),
      ],
    }))
  }

  // Remove a just-sent intent note (Gmail-style undo window).
  function undoSend(changeId) {
    const change = changes.find((c) => c.id === changeId)
    if (!change) return
    const fileId = change.reviewFileId

    setNotesByFile((prev) => ({
      ...prev,
      [fileId]: prev[fileId].filter((n) => n.id !== `note-${changeId}`),
    }))
    setChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, intentNote: null } : c))
    )
  }

  // Add a reviewer note (Comment / Request Change) to a specific file.
  function addReviewNote(fileId, { text, tag }) {
    setNotesByFile((prev) => ({
      ...prev,
      [fileId]: [
        {
          id: `note-manual-${Date.now()}`,
          authorId: currentUserId,
          time: 'just now',
          text,
          tag,
          status: 'open',
          replies: [],
        },
        ...prev[fileId],
      ],
    }))
  }

  // Append a threaded reply to a note within a file, authored by the current user.
  function addReply(fileId, noteId, { text }) {
    setNotesByFile((prev) => ({
      ...prev,
      [fileId]: prev[fileId].map((n) =>
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
      ),
    }))
  }

  // Mark a single note resolved (reviewer clears a flagged issue).
  function resolveNote(fileId, noteId) {
    setNotesByFile((prev) => ({
      ...prev,
      [fileId]: prev[fileId].map((n) =>
        n.id === noteId ? { ...n, status: 'resolved' } : n
      ),
    }))
  }

  function discardIntentNote(changeId) {
    setChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, intentNote: null } : c))
    )
  }

  // Approve a single file (shows its spinner), then mark it approved and
  // resolve that file's notes.
  function approveFile(fileId) {
    setFileApproval((prev) => ({ ...prev, [fileId]: 'submitting' }))
  }

  function finishApproveFile(fileId) {
    setFileApproval((prev) => ({ ...prev, [fileId]: 'approved' }))
    setNotesByFile((prev) => ({
      ...prev,
      [fileId]: prev[fileId].map((n) => ({ ...n, status: 'resolved' })),
    }))
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
      notesByFile,
      openNoteCount,
      fileApproval,
      sessionApproved,
      switchUser,
      sendIntentNote,
      undoSend,
      discardIntentNote,
      addReviewNote,
      addReply,
      resolveNote,
      approveFile,
      finishApproveFile,
      resetApprovals,
    }),
    [changes, notesByFile, openNoteCount, fileApproval, sessionApproved, currentUserId]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useStore must be used within <AppProvider>')
  return ctx
}
