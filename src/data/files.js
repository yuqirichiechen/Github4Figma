// Design Approve flow — files under review
export const files = [
  { id: 'onboarding', name: '01 Onboarding', version: 'V3', meta: 'Comments', status: 'reviewing' },
  { id: 'home', name: '02 Home', version: 'V2', meta: '', status: 'reviewing' },
  { id: 'search', name: '03 Search', version: 'V2', meta: '', status: 'reviewing' },
  { id: 'profile', name: '04 Profile', version: 'V1', meta: '', status: 'reviewing' },
]

// version timeline for the selected file
export const versions = [
  { id: 'v1', label: 'v1', when: '2 days ago', state: 'done' },
  { id: 'v2', label: 'v2', when: '1 day ago', state: 'done' },
  { id: 'v3', label: 'v3', when: '6 hours ago', state: 'done' },
  { id: 'current', label: 'Current', when: 'Review in Progress', state: 'active' },
]

// thumbnails shown in the center panel
export const screens = [
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'home', label: 'Home' },
  { id: 'search', label: 'Search' },
]
