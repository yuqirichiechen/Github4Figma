# GitHub for Figma — Build Plan

> Front-end-only prototype. **React + Vite**. GitHub-style workflow UI, HCI-polished.
> All state is simulated (Wizard-of-Oz) — no backend, no real audio, no real AI.

Team HCI — Kevin Vo · Tenzin Tashi · Yousuf Al-Bassyouni · Richie Chen · CSS 480

---

## 1. Concept

A version-control + review layer for design files, modeled on GitHub's PR workflow.
Two hero flows:

1. **Intent Note** — when a designer changes a component, they attach a short voice note
   explaining *why*. The system shows an AI-generated text summary alongside it.
2. **Design Approve** — a reviewer opens a review session, browses changed files + version
   timeline + everyone's intent notes, then approves the design.

The payoff: teammates understand the *reasoning* behind changes without meetings.

---

## 2. Tech Stack

| Concern        | Choice                                   |
| -------------- | ---------------------------------------- |
| Framework      | React 18 + Vite                          |
| Routing        | react-router-dom (2 routes)              |
| Styling        | CSS Modules + CSS variables (tokens)     |
| State          | React state + one shared store (Context) |
| Icons          | lucide-react                             |
| Animation      | CSS transitions + Framer Motion (optional) |
| Audio sim      | Fake timer + animated waveform (no real mic) |
| Deploy         | Vercel / Netlify / GitHub Pages          |

No backend. No database. No real audio capture. No real AI call.

---

## 3. Design System (Tokens)

Apply the HW color rule: **green = success, red = error/danger, indigo = primary/accent.**

```css
:root {
  /* Brand / accent */
  --indigo-500: #5b5bd6;   /* primary buttons, active nav, record button */
  --indigo-100: #ececfb;   /* selected row bg, intent-note bg */

  /* Status */
  --green-600:  #1f883d;   /* approve, resolved, success */
  --green-100:  #dafbe1;
  --red-600:    #cf222e;   /* recording, request change, needs attention */
  --red-100:    #ffebe9;
  --amber-500:  #d4a72c;   /* "Intent Captured" / pending tags */

  /* Neutrals (GitHub-ish) */
  --bg:         #ffffff;
  --bg-subtle:  #f6f8fa;
  --border:     #d0d7de;
  --text:       #1f2328;
  --text-muted: #656d76;

  /* Shape */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --shadow-sm: 0 1px 2px rgba(31,35,40,.06);
  --shadow-md: 0 8px 24px rgba(31,35,40,.12);

  /* Type */
  --font: -apple-system, "Segoe UI", system-ui, sans-serif;
}
```

Typography scale: 12 (meta) · 14 (body) · 16 (titles) · 20 (section) · 24 (page).

---

## 4. App Layout (no mac window chrome)

GitHub-style shell:

```
┌───────────────────────────────────────────────────────────────┐
│ TopBar:  GitHub for Figma / Mobile App Redesign / Review   [⚪⚪⚪] [Share] │
├──────────────┬────────────────────────────────┬───────────────┤
│  LeftPanel   │          CenterPanel           │  RightPanel    │
│ (files/      │   (timeline / preview /        │ (review        │
│  changes)    │    actions)                    │  details)      │
└──────────────┴────────────────────────────────┴───────────────┘
```

Both flows reuse the same 3-zone shell; only the panel contents change.

---

## 5. Routes & Screens

| Route       | Flow           | Screen states                                            |
| ----------- | -------------- | -------------------------------------------------------- |
| `/changes`  | Intent Note    | empty → tap-to-record → recording → playback → sent      |
| `/review`   | Design Approve | default → confirm dialog → submitting → approved         |

---

## 6. Component Tree

```
App
├── AppShell
│   ├── TopBar (breadcrumb, avatar stack, ShareButton)
│   └── <Outlet/>
│
├── ChangesView (/changes)            ← Intent Note flow
│   ├── ChangedList                   ← left: Logo/Primary, Nav/Header, Landing
│   │   └── ChangedListItem (selected, author, time)
│   └── ComponentDetail               ← center
│       ├── ComponentHeader (title, author·time)
│       ├── ComponentPreview (LOGO box)
│       └── IntentNote                ← the state machine ↓
│           ├── IntentEmpty           (dashed "Add intent note" + mic)
│           ├── IntentReady           (tap to start recording)
│           ├── IntentRecording       (red, Waveform, timer, Stop)
│           ├── IntentPlayback        (play, Waveform, Discard / Send)
│           └── IntentSent            (playback + AiSummary card)
│
└── ReviewView (/review)              ← Design Approve flow
    ├── FilesPanel                    ← left: 01 Onboarding V3 … 04 Profile V1
    │   └── FileItem (version badge, selected, resolved tick)
    ├── ReviewCenter                  ← center
    │   ├── VersionTimeline (v1·v2·v3·Current dots)
    │   ├── ScreenThumbs (Onboarding / Home / Search)
    │   ├── SummaryBar ("3 resolved · 1 needs attention")
    │   └── ReviewActions (Approve / Request Change / Comment)
    ├── ReviewDetails                 ← right
    │   ├── DetailsHeader (sort, filter)
    │   └── IntentNoteCard (author, time, "Intent Captured" tag, text)
    ├── ApproveDialog (modal)         ← "Approve this design?"
    └── ApprovingOverlay (spinner)    ← "Submitting Approval…"

Shared primitives: Button · Card · Badge · Avatar · Waveform · Modal · Spinner
```

---

## 7. Mock Data Model (`/src/data`)

```ts
// users.js
User      = { id, name, initials, color }

// changes.js  (Intent Note flow)
Change    = {
  id, componentName,        // "Logo / Primary"
  authorId, updatedAt,      // "2m ago"
  previewLabel,             // "LOGO"
  intentNote: IntentNote | null
}

IntentNote = {
  id, authorId,
  durationSec,              // fake length, e.g. 7
  status,                   // 'recording' | 'preview' | 'sent'
  aiSummary                 // pre-written string, shown after send
}

// files.js  (Design Approve flow)
File      = { id, name, version, status }   // status: 'reviewing' | 'resolved'

Version   = { id, label, when, state }      // 'v1' | 'current', state: done|active

ReviewNote = {
  id, authorId, time, text,
  tag,                      // 'Intent Captured' | 'Needs Attention'
  status                    // 'open' | 'resolved'
}

reviewMeta = { resolvedCount: 3, needsAttention: 1, collaborators: 3 }
```

**Shared store (Context):** intent notes created in `/changes` push into the
`reviewNotes` list so they appear in `/review` — this connects the two flows.

---

## 8. State Machines

### Flow 1 — Intent Note
```
empty ──(click mic)──▶ recording ──(Stop)──▶ playback
                                               │
                            ┌──────────────────┤
                       (Discard)           (Send Note)
                            │                  │
                            ▼                  ▼
                          empty              sent  (+ AI summary fades in,
                                                    note pushed to reviewNotes)
```
Simulated bits: `recording` runs a fake `setInterval` timer + animated waveform;
`sent` reveals a hardcoded `aiSummary` string after a short delay.

### Flow 2 — Design Approve
```
default ──(Approve)──▶ confirmDialog ──(Confirm)──▶ submitting
                            │                          │ (~1.5s fake delay)
                       (Cancel)                        ▼
                            │                       approved
                            ▼            (timeline + thumbs turn green,
                         default          all notes → 'resolved',
                                          Approve button disabled)
```
Side flows: `Request Change` and `Comment` open lightweight secondary states.

---

## 9. Sprint Plan

| Sprint | Goal | Demoable outcome |
| ------ | ---- | ---------------- |
| **0** | Foundation & design system: Vite scaffold, routing, tokens, primitives, mock data | Shell renders, nav between two empty flows |
| **1** | Intent Note static screens: changed list + detail + all 5 states as static views | Click through every state manually |
| **2** | Intent Note interactions: full record→playback→send→AI-summary state machine + animated waveform/timer | End-to-end flow on one click path |
| **3** | Design Approve static layout: 3 panels, files, version timeline, summary bar, review cards | Review session fully populated |
| **4** | Design Approve interactions: approve dialog → submitting → approved state; request-change/comment; file switching | Full approval flow + state changes |
| **5** | Polish & ship: connect both flows (shared store), hover/focus/empty states, transitions, a11y, deploy + README | One continuous story, hosted live |

Each sprint ends in a working build.

---

## 10. Folder Structure

```
src/
├── main.jsx
├── App.jsx
├── tokens.css
├── store/            # shared Context (intent notes ↔ review notes)
├── data/             # users, changes, files, versions, reviewNotes
├── components/       # Button, Card, Badge, Avatar, Waveform, Modal, Spinner
├── layout/           # AppShell, TopBar
├── flows/
│   ├── changes/      # ChangesView + IntentNote states
│   └── review/       # ReviewView + dialog/overlay
└── styles/
```

---

## 11. Definition of Done (whole project)

- [ ] Both flows run start-to-finish with no dead ends
- [ ] Intent note from Flow 1 shows up in Flow 2's Review Details
- [ ] Every interactive element has hover + focus states
- [ ] Color rule honored (green success / red error / indigo accent)
- [ ] Animated waveform + fake timer feel believable
- [ ] AI summary reveals on Send
- [ ] Approve flow ends in fully-green "approved" state
- [ ] Deployed to a public URL + README with run instructions
```
