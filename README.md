# TickrX

A realistic, gamified stock trading simulator — $100,000 in virtual funds, live market data, full charting, and social competition.

> Built by Claude AI · Next.js 15 · Polygon.io · TradingView

---

## What it is

TickrX lets you practice trading with real market data and zero financial risk. Inspired by eToro's demo trading experience — live prices, candlestick charts, a watchlist, portfolio tracking, and a leaderboard to compete against other traders.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Icons | `lucide-react` |
| Toasts | `sonner` |
| Animation | `framer-motion` |
| Market data | Polygon.io REST + WebSocket |
| Charts | TradingView (embedded widgets) |
| Types | TypeScript strict |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` file in the project root:

```env
POLYGON_API_KEY=your_polygon_key
OPENAI_API_KEY=your_openai_key
```

---

## Project Structure

```
src/
├── app/
│   ├── api/               # Route handlers (stocks, crypto, analysis, ask-stock)
│   ├── stock/[tickr]/     # Stock detail page
│   └── page.tsx           # Home dashboard
├── components/            # Reusable UI components (see COMPONENT_REGISTRY.md)
└── types/                 # TypeScript interfaces
scripts/
├── claude-review.js       # Code Review Agent (Agent 6)
└── scan-components.js     # Component Memory Agent scanner (Agent 2)
```

---

## Agent Pipeline

Every PR triggers a 9-agent automated pipeline:

```
PR opened
    │
    ▼
Component Memory Agent  →  injects COMPONENT_REGISTRY.md as PR comment
    │
    ▼
Test Agent  ──┐
Lint Agent  ──┼──  run in parallel
Security    ──┘
    │
    ▼
Code Review Agent  →  Claude reviews diff vs component registry
    │
    ▼
Preview Build Agent  →  deploys Vercel preview, posts URL to PR
    │
    ▼
Merge
    │
    ▼
Changelog Agent + Component Memory Agent update registry
```

| Agent | Workflow | Role |
|---|---|---|
| Developer (you) | — | Writes code, opens PRs |
| Component Memory | `component-memory.yml` | Prevents component duplication |
| Test | `test.yml` | Jest + coverage (80% threshold) |
| Lint & Format | `lint.yml` | ESLint + Prettier, auto-commits fixes |
| Security | `security.yml` | npm audit, gitleaks, env var scan |
| Code Review | `code-review.yml` | Claude API reviews every diff |
| Preview Build | `preview.yml` | Vercel preview per PR |
| Dep Updater | — | Renovate Bot, weekly Mondays |
| Changelog | `changelog.yml` | conventional-changelog on merge |

See [`PRD.md`](./PRD.md) for full agent specs and prompt templates.

---

## Build Phases

| Phase | Status | Description |
|---|---|---|
| Phase 0 | Planned | Wireframe design — all 10 screens |
| Phase 1 | Planned | Expo scaffold, Google Auth, $100k portfolio |
| Phase 2 | Planned | Polygon.io market data, watchlist |
| Phase 3 | Planned | Stock detail, TradingView charts |
| Phase 4 | Planned | Trading engine, order ticket, portfolio |
| Phase 5 | Planned | Leaderboard, gamification, deployment |

---

## Contributing

Before writing any component:

1. Read [`COMPONENT_REGISTRY.md`](./COMPONENT_REGISTRY.md) — reuse before creating
2. Read the relevant section in [`PRD.md`](./PRD.md)
3. Use preferred libs: `lucide-react` (icons) · `sonner` (toasts) · `vaul` (drawers)
4. Write tests alongside every feature (≥ 80% coverage)
5. Open a PR — the agent pipeline runs automatically

See [`CLAUDE.md`](./CLAUDE.md) for the full Developer Agent instructions.

---

## Required GitHub Secrets

Add in **Settings → Secrets and variables → Actions**:

| Secret | Used by |
|---|---|
| `ANTHROPIC_API_KEY` | Code Review Agent |
| `VERCEL_TOKEN` | Preview Build Agent |
| `VERCEL_ORG_ID` | Preview Build Agent |
| `VERCEL_PROJECT_ID` | Preview Build Agent |
