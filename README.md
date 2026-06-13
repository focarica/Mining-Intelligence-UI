# Mining Intelligence UI

The frontend for the [Mining Intelligence Pipeline](https://github.com/focarica/Mining-Intelligence-Pipeline) — an applied AI study project. Built with Angular 21, it provides a clean interface to trigger the extraction pipeline, browse company profiles, and run semantic Q&A queries over ingested documents.

---

## Features

- **Search & extract** — submit one or more company names to trigger the backend pipeline; displays per-company status (success / failed / skipped) with a live elapsed timer
- **Company directory** — browse all ingested companies with links to their websites
- **Company detail** — view structured leadership profiles (executives and board members) and mining assets with commodity and location data
- **Semantic Q&A** — ask natural language questions about any company; the backend uses RAG (pgvector + Gemini) to return a grounded answer with source citations

---

## Tech Stack

| | Choice |
|---|---|
| Framework | Angular 21 |
| Language | TypeScript 5.9 |
| State | Angular Signals |
| Styling | Tailwind CSS 4 |
| Testing | Vitest |
| Package manager | npm |

Angular Signals replace RxJS-heavy patterns for local component state, keeping reactivity explicit and lightweight.

---

## Project Structure

```
src/app/
├── components/
│   ├── search/          # Pipeline trigger + results display
│   ├── companies/       # Company list table
│   └── company-detail/  # Leader profiles, asset table, Q&A chat
├── services/
│   └── api.service.ts   # Typed HTTP client for all backend calls
├── models/
│   └── index.ts         # TypeScript interfaces (Company, Leader, Asset, Q&A)
├── app.routes.ts        # Route definitions
└── app.config.ts        # Angular application config
```

Routes:

| Path | Component |
|---|---|
| `/search` | Search and trigger extraction |
| `/companies` | Browse all companies |
| `/companies/:id` | Company detail with Q&A |

---

## Getting Started

### Prerequisites

- Node.js 20+
- The [Mining Intelligence Pipeline](https://github.com/focarica/Mining-Intelligence-Pipeline) backend running on port 8000

### Install and run

```bash
npm install
ng serve
```

Open `http://localhost:4200`.

The API base URL is set in `src/app/services/api.service.ts`. By default it points to `http://localhost:8000/api` for local development.

### Build

```bash
ng build
```

Production artifacts are output to `dist/`.

### Tests

```bash
ng test
```
