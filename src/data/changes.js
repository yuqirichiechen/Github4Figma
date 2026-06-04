// Intent Note flow — components changed in figma-vc / logo-redesign
export const changes = [
  {
    id: 'logo-primary',
    componentName: 'Logo / Primary',
    authorId: 'richie',
    updatedAt: '2m ago',
    previewLabel: 'LOGO',
    reviewFileId: 'onboarding', // intent note surfaces under this review file
    intentNote: null, // populated at runtime through the store
    seededSummary:
      'Richie updated the logo to better reflect the new brand direction. Previous version felt too generic.',
  },
  {
    id: 'nav-header',
    componentName: 'Nav / Header',
    authorId: 'kevin',
    updatedAt: '14m ago',
    previewLabel: 'NAV',
    reviewFileId: 'home',
    intentNote: null,
    seededSummary:
      'Kevin tightened the header spacing and aligned nav items to the new 8px grid.',
  },
  {
    id: 'landing',
    componentName: 'Landing',
    authorId: 'noga',
    updatedAt: '1h ago',
    previewLabel: 'LANDING',
    reviewFileId: 'search',
    intentNote: null,
    seededSummary:
      'Noga reworked the hero layout to lead with the product value prop above the fold.',
  },
]
