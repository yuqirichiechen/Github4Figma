// Design Approve flow — each file is its own independent review with its own
// version history, screens, and per-version intent notes.

// v1–v3 are historical (mock-approved); "Current" is the live, approvable one.
const history = (a, b, c) => [
  { id: 'v1', label: 'v1', when: '2 days ago', state: 'approved', by: a },
  { id: 'v2', label: 'v2', when: '1 day ago', state: 'approved', by: b },
  { id: 'v3', label: 'v3', when: '6 hours ago', state: 'approved', by: c },
  { id: 'current', label: 'Current', when: 'Review in Progress', state: 'active' },
]

// note(): a review-detail comment. `opts` can carry a tag, status, a voice clip
// ({ durationSec }), and an AI summary string.
const note = (id, authorId, time, text, opts = {}) => ({
  id,
  authorId,
  time,
  text: text ?? null,
  tag: opts.tag ?? 'Intent Captured',
  status: opts.status ?? 'open',
  replies: opts.replies ?? [],
  voice: opts.voice ?? null,
  aiSummary: opts.aiSummary ?? null,
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
    notesByVersion: {
      v1: [
        note('on-v1-1', 'noga', '2 days ago', 'Initial onboarding structure — three guided steps.', { status: 'resolved' }),
      ],
      v2: [
        note('on-v2-1', 'jordan', '1 day ago', 'Swapped the illustration set to match the new brand.', { status: 'resolved' }),
        note('on-v2-2', 'richie', '1 day ago', null, {
          status: 'resolved',
          voice: { durationSec: 9 },
          aiSummary: 'Richie tightened the sign-up form spacing to the 8px grid for a steadier rhythm.',
        }),
      ],
      v3: [
        note('on-v3-1', 'noga', '6 hours ago', null, {
          status: 'resolved',
          voice: { durationSec: 11 },
          aiSummary: 'Noga reworked the welcome copy to lead with the product value prop instead of generic greetings.',
        }),
      ],
      current: [
        note('on-1', 'noga', '2m ago', 'Love the progress dots — today’s tasks stand out more prominently.'),
        note('on-2', 'jordan', '10:42 AM', null, {
          voice: { durationSec: 6 },
          aiSummary: 'Jordan suggests simplifying the bottom nav icons to cut visual clutter.',
        }),
        note('on-3', 'kevin', 'Yesterday', 'Contrast on the secondary buttons looks low — worth another pass.', { tag: 'Needs Attention' }),
      ],
    },
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
    notesByVersion: {
      v1: [
        note('hm-v1-1', 'richie', '2 days ago', 'First pass at the home layout.', { status: 'resolved' }),
      ],
      v2: [
        note('hm-v2-1', 'noga', '1 day ago', null, {
          status: 'resolved',
          voice: { durationSec: 7 },
          aiSummary: 'Noga moved the feed to a single column for readability on smaller screens.',
        }),
      ],
      v3: [
        note('hm-v3-1', 'jordan', '6 hours ago', 'Added the Stories row above the feed.', { status: 'resolved' }),
      ],
      current: [
        note('hm-1', 'noga', '5m ago', 'The new card hierarchy makes the feed much easier to scan.'),
        note('hm-2', 'kevin', '9:15 AM', 'Hero spacing feels tight on smaller screens.', { tag: 'Needs Attention' }),
      ],
    },
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
    notesByVersion: {
      v1: [
        note('se-v1-1', 'jordan', '2 days ago', 'Basic search field with a recent list.', { status: 'resolved' }),
      ],
      v2: [
        note('se-v2-1', 'richie', '1 day ago', null, {
          status: 'resolved',
          voice: { durationSec: 8 },
          aiSummary: 'Richie added a Recent Searches section so the empty state still feels useful.',
        }),
      ],
      v3: [
        note('se-v3-1', 'noga', '6 hours ago', 'Introduced filter chips under the search bar.', { status: 'resolved' }),
      ],
      current: [
        note('se-1', 'richie', '12m ago', 'Recent searches section is a nice touch — keeps it sticky.'),
        note('se-2', 'jordan', 'Yesterday', 'Filter chips need more contrast to read as tappable.', { tag: 'Needs Attention' }),
      ],
    },
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
    notesByVersion: {
      v1: [
        note('pr-v1-1', 'noga', '2 days ago', 'Initial profile with avatar and bio.', { status: 'resolved' }),
      ],
      v2: [
        note('pr-v2-1', 'jordan', '1 day ago', 'Added the edit-profile sheet.', { status: 'resolved' }),
      ],
      v3: [
        note('pr-v3-1', 'richie', '6 hours ago', null, {
          status: 'resolved',
          voice: { durationSec: 10 },
          aiSummary: 'Richie added an inline avatar preview so users see the crop before saving.',
        }),
      ],
      current: [
        note('pr-1', 'noga', '1h ago', 'Avatar upload flow reads clearly now — good call on the inline preview.'),
      ],
    },
  },
]
