# EngiLearn

An interactive engineering learning and practice platform for students in **Information
Technology**, **Electronics & Communication Engineering (ECE)**, and **Electrical &
Electronics Engineering (EEE)**. EngiLearn combines structured learning modules, an online
code compiler, interactive circuit simulations, practice problems, and progress tracking
into one product.

> **Status: Frontend complete.** This repository currently contains only the frontend.
> All data is mock data (see `src/data/`) and all "execution" in the compiler is simulated
> (see `src/services/compilerService.js`). No backend, database, or real authentication
> exists yet.

---

## Features

- **Structured learning** -- department to learning category to module, with theory sections,
  code examples, and completion tracking
- **Interactive simulations** -- a logic gate simulator with a live truth table, and a D
  flip-flop waveform simulator, embedded directly in relevant ECE modules
- **Practice system** -- searchable, filterable problem list (department, difficulty,
  completion status) with full problem detail pages (statement, constraints, examples,
  progressive hints, related problems)
- **Online compiler / code playground** -- a three-pane IDE layout (problem, editor, tabbed
  test cases/console/result) supporting 9 languages with starter templates, backed by a
  mock `compilerService`
- **Dashboard & Progress** -- streaks, stats, recent activity, recommendations, per-department
  and per-subject progress bars, and a skill matrix
- **Achievements** -- a badge grid of earned/locked milestones
- **Profile & Settings** -- editable profile (name, bio, skills, recent submissions) and a
  notification-preferences form
- **Global search** -- search across departments, learning categories, modules, and problems
- **Responsive** -- sidebar on desktop, a bottom tab bar on mobile; every page reflows down
  to a single column
- **Accessible** -- semantic landmarks, a skip-to-content link, visible keyboard focus rings,
  labeled form controls

## Tech stack

- React 19 + Vite
- React Router v7
- Plain CSS (custom design-token system in `src/styles/`) -- **no Tailwind, no UI framework**
- [lucide-react](https://lucide.dev/) for icons

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build locally
npm run lint     # oxlint
```

## Project structure

```text
engilearn/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/          # Button, Card, Badge, ProgressBar, loading/empty/error states
│   │   ├── navigation/      # Navbar, Sidebar, MobileNav, Footer, PublicLayout, AppLayout
│   │   ├── dashboard/       # StatsCard, ContinueLearningCard, ActivityCard, SkillMatrix, ...
│   │   ├── learning/        # DepartmentCard, CategoryCard, ModuleCard, simulations/
│   │   ├── practice/        # ProblemCard, FilterBar, ProblemNavPanel
│   │   ├── compiler/        # LanguageSelector, CodeEditor, ProblemPanel, OutputPanel, ...
│   │   ├── achievements/    # AchievementCard
│   │   └── profile/         # ProfileHeader, EditProfileModal
│   ├── pages/                # one folder per route (Landing, Dashboard, Compiler, ...)
│   ├── data/                  # mock data: departments, modules, problems, users, progress,
│   │                          # achievements, languages
│   ├── services/              # authService.js, compilerService.js -- the backend seams
│   ├── routes/                # AppRoutes.jsx -- every route in one place
│   ├── styles/                 # variables.css (tokens), global.css, components.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

## Available routes

**Public** -- `/`, `/about`, `/features`, `/learning-paths`, `/departments`,
`/departments/:departmentId`, `/departments/:departmentId/:categoryId`,
`/departments/:departmentId/:categoryId/:moduleId`, `/login`, `/register`, `/search`

**Authenticated** (no real auth gate yet -- reachable directly) -- `/dashboard`,
`/my-learning`, `/practice`, `/problem/:problemId`, `/compiler`, `/progress`,
`/achievements`, `/profile`, `/settings`

Unmatched paths render a 404 page.

## Mock data

Everything under `src/data/` is static, hand-written mock data standing in for a future
API:

| File | Stands in for |
|---|---|
| `departments.js` | `GET /api/departments` (with nested learning categories) |
| `modules.js` | `GET /api/departments/:id/categories/:catId/modules` |
| `problems.js` | `GET /api/problems`, `GET /api/problems/:id` |
| `users.js` | `GET /api/users/me` |
| `progress.js` | `GET /api/progress`, `GET /api/activity` |
| `achievements.js` | `GET /api/achievements` |
| `languages.js` | Compiler language/starter-template config |

## Compiler architecture

`src/services/compilerService.js` exports `runCode()` and `submitCode()`. Both return
Promises shaped like a real judge's response, but internally just `setTimeout` and return
canned data -- **no code is ever actually executed in the browser.**

This is the intended integration seam for a real backend:

```text
Compiler UI  ->  Compiler API  ->  Secure execution environment  ->  Test results  ->  Compiler UI
```

`runCode()` and `submitCode()` are the two functions to repoint at a real backend (e.g.
Judge0, a Docker-based sandbox, or WASM runtimes for browser-safe languages). Their
function signatures are meant to stay stable across that swap so no UI changes are
required.

The code editor (`src/components/compiler/CodeEditor.jsx`) is a plain `<textarea>` with a
line-number gutter, deliberately kept dependency-free. A comment in that file marks exactly
where a real editor (e.g. Monaco Editor) would be swapped in.

## Future backend architecture (not implemented)

```text
React (this repo)
    |
    v
Node.js + Express
    |
    v
REST APIs
    |
    v
MongoDB
```

Planned backend modules: Authentication, Users, Departments, Courses/Modules, Problems,
Submissions, Compiler, Progress, Achievements, Notifications.

Likely MongoDB collections: `users`, `departments`, `categories`, `modules`, `problems`,
`submissions`, `progress`, `achievements`.

`src/services/authService.js` and `src/services/compilerService.js` are the two files
designed to be rewritten (same function signatures) to call the real backend once it
exists -- everything else in the app calls through them or through the mock data modules,
so the UI itself should not need to change.

## What's intentionally not here yet

- No real authentication or session persistence (Login/Register validate and redirect, but
  don't create a real account)
- No real code execution (Compiler is fully mocked)
- No backend, database, or REST API calls of any kind
- No automated tests

## Deployment (once a backend exists)

For now, `npm run build` produces a static `dist/` folder that can be deployed to any
static host (Vercel, Netlify, GitHub Pages, etc.) for frontend-only preview purposes. Once
the backend is built, the frontend's `services/` layer will need environment-based API base
URLs to point at the deployed backend.
