export const users = {
  richie: { id: 'richie', name: 'Richie', initials: 'RC', color: '#5b5bd6' },
  noga: { id: 'noga', name: 'Noga', initials: 'NG', color: '#1f883d' },
  jordan: { id: 'jordan', name: 'Jordan', initials: 'JD', color: '#cf222e' },
  kevin: { id: 'kevin', name: 'Kevin', initials: 'KV', color: '#d4a72c' },
}

export const collaborators = [users.richie, users.noga, users.jordan]

// The two swappable accounts for the demo, each with its home screen.
export const accounts = [
  { id: 'richie', role: 'Designer', home: '/changes' },
  { id: 'noga', role: 'Reviewer', home: '/review' },
]
