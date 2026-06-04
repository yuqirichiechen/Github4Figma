// Design Approve flow — each file is its own independent review with its
// own version history, screens, and intent notes.

// v1–v3 are historical (mock-approved); "Current" is the live, approvable one.
const history = (a, b, c) => [
  { id: 'v1', label: 'v1', when: '2 days ago', state: 'approved', by: a },
  { id: 'v2', label: 'v2', when: '1 day ago', state: 'approved', by: b },
  { id: 'v3', label: 'v3', when: '6 hours ago', state: 'approved', by: c },
  { id: 'current', label: 'Current', when: 'Review in Progress', state: 'active' },
]

const note = (id, authorId, time, text, tag = 'Intent Captured') => ({
  id,
  authorId,
  time,
  text,
  tag,
  status: 'open',
  replies: [],
})

export const files = [
  {
    id: 'onboarding',
    name: '01 Onboarding',
    version: 'V3',
    meta: 'Comments',
    versions: history('noga', 'jordan', 'noga'),
    screens: [
      { id: 'welcome', label: 'Welcome' },
      { id: 'signup', label: 'Sign Up' },
      { id: 'perms', label: 'Permissions' },
    ],
    notes: [
      note('on-1', 'noga', '2m ago', 'Love the progress dots — today’s tasks stand out more prominently.'),
      note('on-2', 'jordan', '10:42 AM', 'Let’s simplify the bottom nav icons for better clarity.'),
      note('on-3', 'kevin', 'Yesterday', 'Contrast on the secondary buttons looks low — worth another pass.', 'Needs Attention'),
    ],
  },
  {
    id: 'home',
    name: '02 Home',
    version: 'V2',
    meta: '',
    versions: history('richie', 'noga', 'jordan'),
    screens: [
      { id: 'feed', label: 'Feed' },
      { id: 'stories', label: 'Stories' },
      { id: 'activity', label: 'Activity' },
    ],
    notes: [
      note('hm-1', 'noga', '5m ago', 'The new card hierarchy makes the feed much easier to scan.'),
      note('hm-2', 'kevin', '9:15 AM', 'Hero spacing feels tight on smaller screens.', 'Needs Attention'),
    ],
  },
  {
    id: 'search',
    name: '03 Search',
    version: 'V2',
    meta: '',
    versions: history('jordan', 'richie', 'noga'),
    screens: [
      { id: 'explore', label: 'Explore' },
      { id: 'results', label: 'Results' },
      { id: 'filters', label: 'Filters' },
    ],
    notes: [
      note('se-1', 'richie', '12m ago', 'Recent searches section is a nice touch — keeps it sticky.'),
      note('se-2', 'jordan', 'Yesterday', 'Filter chips need more contrast to read as tappable.', 'Needs Attention'),
    ],
  },
  {
    id: 'profile',
    name: '04 Profile',
    version: 'V1',
    meta: '',
    versions: history('noga', 'jordan', 'richie'),
    screens: [
      { id: 'profile', label: 'Profile' },
      { id: 'edit', label: 'Edit' },
      { id: 'settings', label: 'Settings' },
    ],
    notes: [
      note('pr-1', 'noga', '1h ago', 'Avatar upload flow reads clearly now — good call on the inline preview.'),
    ],
  },
]
