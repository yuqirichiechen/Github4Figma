# GitHub for Figma

A front-end-only prototype of a version-control + review layer for design files,
modeled on GitHub's pull-request workflow. Built for CSS 480 (HCI) at UW by Team HCI —
Kevin Vo · Tenzin Tashi · Yousuf Al-Bassyouni · Richie Chen.

There is **no backend**. All state is simulated (Wizard-of-Oz): no real microphone,
no real audio, no real AI. The point is to demonstrate the *interaction design*.

## Two flows

1. **Intent Note** (`/changes`) — a designer attaches a short voice note explaining the
   intent behind a component change. Flow: empty → record (live timer) → playback →
   send → an AI-generated text summary appears.
2. **Design Approve** (`/review`) — a reviewer browses changed files, the version
   timeline, and everyone's intent notes, then approves: confirm dialog → submitting →
   approved (everything turns green, notes resolve).

The two flows share one store, so a note recorded in **Changes** shows up live in the
**Review Details** panel — no reload.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Tech

React 18 · Vite · React Router · CSS Modules + design tokens · lucide-react icons.

```
src/
├── components/   reusable primitives (Button, Card, Badge, Avatar, Waveform, Modal, Spinner)
├── layout/       AppShell + TopBar
├── store/        shared Context store (links the two flows)
├── data/         mock users, changes, files, versions, review notes
└── flows/
    ├── changes/  Intent Note flow
    └── review/   Design Approve flow
```

## Deploy (GitHub Pages)

A workflow at `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
To enable it once: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The site publishes at `https://yuqirichiechen.github.io/Github4Figma/`.

The build uses a `/Github4Figma/` base path only on Pages (via the `GITHUB_PAGES` env var);
local builds and Vercel/Netlify deploys serve from root automatically.
