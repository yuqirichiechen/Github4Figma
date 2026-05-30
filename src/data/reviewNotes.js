// Design Approve flow — intent notes shown in the Review Details panel.
// New notes created in the Intent Note flow get prepended to this list via the store.
export const seedReviewNotes = [
  {
    id: 'note-noga',
    authorId: 'noga',
    time: '2m ago',
    text: 'Love the preceding counter making today’s tasks stand out more prominent.',
    tag: 'Intent Captured',
    status: 'open',
  },
  {
    id: 'note-jordan',
    authorId: 'jordan',
    time: '10:42 AM',
    text: 'Let’s simplify the bottom nav icons for better clarity.',
    tag: 'Intent Captured',
    status: 'open',
  },
]

export const reviewMeta = {
  resolvedCount: 3,
  needsAttention: 1,
  collaborators: 3,
}
