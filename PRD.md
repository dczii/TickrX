# TickrX — Product Requirements Document

> Version 3.0 · Cross-platform paper trading app (Web + iOS + Android) · Built by Claude AI

---

## Overview

TickrX is a realistic, gamified stock trading simulator giving users $100,000 in virtual funds to practice trading with live market data, full charting, and social features — inspired by eToro's demo trading experience.

- **Framework:** React Native + Expo SDK 52 (single codebase for Web, iOS, Android)

- **Auth:** Google OAuth via Firebase Auth

- **Database:** Firebase Firestore + Cloud Functions

- **Market Data:** Polygon.io API

- **Hosting:** Vercel (web) · Firebase (backend) · EAS (mobile distribution)

- **Starting balance:** $100,000 virtual USD per user

---

## Cross-Platform Strategy

- React Native + Expo: one codebase ships Web, iOS, and Android

- Expo Router for file-based navigation (web + native parity)

- `react-native-webview` embeds TradingView charts on mobile

- NativeWind v4 (Tailwind for RN) keeps styling consistent cross-platform

- EAS Build compiles iOS `.ipa` and Android `.apk` for store submission

- Shared business logic — API calls, auth, portfolio state — across all platforms

- Wireframes approved before any code is written — design-led development

---

## Build Phases

### Phase 0 — Wireframe Design (Claude Design)

All 10 screens wireframed and approved before writing a single line of code.

**Screens to design:**

1. Onboarding / Google sign-in

2. Home dashboard (portfolio value, top movers, watchlist preview)

3. Markets screen (search, sector heatmap, top gainers/losers)

4. Watchlist (ticker list with live price + sparkline)

5. Stock detail (price header, TradingView candlestick chart, timeframe tabs, fundamentals)

6. Buy / sell order ticket (bottom sheet, market/limit toggle, $ or shares input, confirm button)

7. Portfolio screen (total value, P&L, holdings list, performance chart)

8. Trade history (filled orders log with ticker, size, price, P&L)

9. Leaderboard (ranked users by return %, avatar, weekly/all-time toggle)

10. Profile / settings (avatar, stats, reset portfolio, preferences)

**Claude Design Prompt — Mobile Wireframes:**

```
You are designing wireframes for TickrX, a mobile-first paper stock trading app (React Native + Expo).

Design all 10 screens as high-fidelity mobile wireframes using a dark-mode trading terminal aesthetic —
tight data density, monospace numbers, sharp green/red P&L indicators, charcoal surfaces.

Screens to design in order:

1. Onboarding / Google sign-in
2. Home dashboard (portfolio value, top movers, watchlist preview)
3. Markets screen (search, sector heatmap, top gainers/losers)
4. Watchlist (ticker list with live price + sparkline)
5. Stock detail (price header, TradingView candlestick chart, timeframe tabs, fundamentals)
6. Buy / sell order ticket (bottom sheet, market/limit toggle, $ or shares input, confirm button)
7. Portfolio screen (total value, P&L, holdings list, performance chart)
8. Trade history (filled orders log with ticker, size, price, P&L)
9. Leaderboard (ranked users by return %, avatar, weekly/all-time toggle)
10. Profile / settings (avatar, stats, reset portfolio, preferences)

Each screen must show: status bar, bottom tab navigation (Home, Markets, Portfolio, Profile),
realistic dummy data, and exact component placement. Design mobile-first at 390x844px (iPhone 15 Pro).

After all screens are approved, code begins in Phase 1.
```

**Claude Design Prompt — Web Layout (additive):**

```
Also design the web layout variant for the same screens at 1440px wide. Use a two-panel layout:
left sidebar navigation (240px) + main content area. The stock detail screen should show the
TradingView chart full-width with the order ticket as a fixed right panel (320px). The portfolio
screen uses a data-table layout with sortable columns. Maintain the same dark terminal aesthetic
across web and mobile.
```

**Phase 0 deliverables before moving to Phase 1:**

- Color tokens: background, surface, accent green, accent red, muted text

- Typography scale: display numbers (monospace), labels, body, captions

- Bottom tab navigation structure locked

- Reusable component list identified

- Stakeholder sign-off on all 10 screens

- Design tokens exported for Phase 1 handoff

- `COMPONENT_REGISTRY.md` seeded with Phase 0 components

---

### Phase 1 — Project Scaffold & Auth

**Claude Code Prompt:**

```
Scaffold a React Native + Expo SDK 52 project with Expo Router, NativeWind v4, and Firebase.
Implement Google OAuth via expo-auth-session + Firebase Auth. Create the bottom tab navigator
(Home, Markets, Portfolio, Profile) matching the approved Phase 0 wireframes. Auto-create a
$100,000 virtual portfolio document in Firestore on first login. Apply the design tokens
(colors, typography, spacing) defined in Phase 0.

Before writing any component, read COMPONENT_REGISTRY.md and reuse existing components.
Write Jest + React Native Testing Library tests for every feature. All tests must pass.
Once complete, use `gh pr create` to open a PR — this will trigger the full agent pipeline automatically.
```

**Features:**

- Expo monorepo with web + iOS + Android targets

- Google OAuth via Firebase Auth (`expo-auth-session`)

- Tab navigation matching Phase 0 wireframes exactly

- Firestore schema: `users`, `portfolios`, `watchlists`, `trades`

- Auto-create $100,000 virtual portfolio on first login

- NativeWind tokens from Phase 0 design system applied

**Tests required:**

- Google OAuth flow (mock Firebase Auth)

- Portfolio document creation on first login

- Tab navigation rendering all 4 screens

- Firestore schema validation

- Session persistence across app restart

---

### Phase 2 — Market Data & Watchlist

**Claude Code Prompt:**

```
Integrate Polygon.io REST and WebSocket APIs. Build the Markets screen and Watchlist screen
matching Phase 0 wireframes pixel-for-pixel. Implement: stock search with debounce, live price
ticks via WebSocket, watchlist CRUD in Firestore, ticker row component (name, price, change %,
7-day sparkline). Use React Query for caching.

Before writing any component, read COMPONENT_REGISTRY.md and reuse existing components.
Write tests for all features. Open a PR when done.
```

**Features:**

- Polygon.io REST: ticker search, snapshot, fundamentals

- Polygon.io WebSocket for live price ticks

- Watchlist: add/remove tickers, stored in Firestore

- Home feed: top movers, most active, sector heatmap

- `TickerRow`, `SparklineChart` components registered to memory

**Tests required:**

- Polygon.io REST mock responses

- WebSocket connection + price tick handling

- Watchlist add/remove/persist in Firestore

- Debounced search input

- TickerRow renders correct price and change %

---

### Phase 3 — Stock Detail & Charting

**Claude Code Prompt:**

```
Build the Stock Detail screen from Phase 0 wireframes. Embed TradingView Lightweight Charts
via react-native-webview. Implement timeframe switching (1m 5m 15m 1h 4h 1D 1W 1M), technical
indicators (SMA, EMA, RSI, MACD, Bollinger Bands, VWAP, Volume), fundamentals panel, and
Polygon.io news feed. The chart must feel native on both web and mobile.

Before writing any component, read COMPONENT_REGISTRY.md and reuse existing components.
Write tests for all features. Open a PR when done.
```

**Features:**

- TradingView Lightweight Charts via WebView (iOS/Android/Web)

- Timeframes: 1m 5m 15m 1h 4h 1D 1W 1M

- Indicators: SMA, EMA, RSI, MACD, Bollinger Bands, VWAP, Volume

- Fundamentals panel: P/E, EPS, 52w range, dividend, earnings date

- Per-ticker news from Polygon.io news endpoint

**Tests required:**

- Timeframe switching updates chart data

- Indicator toggle on/off

- Fundamentals data renders correctly

- News feed loads and displays articles

- WebView bridge message passing

---

### Phase 4 — Trading Engine & Portfolio

**Claude Code Prompt:**

```
Build the Buy/Sell order ticket (bottom sheet on mobile, right panel on web) and Portfolio screen
matching Phase 0 wireframes. Implement: market and limit orders, input by $ or shares, Firebase
Cloud Functions for order execution and P&L calculation, trade history log, portfolio performance
chart vs S&P 500, and Expo push notifications for price alerts.

Before writing any component, read COMPONENT_REGISTRY.md and reuse existing components.
Write tests for all features including order execution logic in Cloud Functions. Open a PR when done.
```

**Features:**

- Market & limit orders, input by $ or shares

- One-tap confirm bottom sheet (eToro-style)

- Portfolio: total value, daily P&L, holdings breakdown

- Trade history: all fills with timestamp, price, size, realised P&L

- Portfolio performance chart vs S&P 500 benchmark

- Price alerts via Expo push notifications

**Tests required:**

- Market order execution deducts correct balance

- Limit order queues and fills at target price

- P&L calculation accuracy (unit tests)

- Portfolio value aggregation

- Price alert triggers push notification

- Insufficient funds rejection

---

### Phase 5 — Social, Gamification & Deployment

**Claude Code Prompt:**

```
Build the Leaderboard and Profile screens from Phase 0 wireframes. Implement: global leaderboard
ranked by portfolio return %, XP and achievement badges, copy trading (mirror top users
proportionally), portfolio reset (once per 7 days with archive). Then configure EAS Build for
Apple App Store and Google Play Store submission, and deploy the web version to Vercel with
PWA manifest and OG metadata.

Before writing any component, read COMPONENT_REGISTRY.md and reuse existing components.
Write tests for all features. Open a PR when done.
```

**Features:**

- Global leaderboard ranked by portfolio return %, weekly + all-time

- Achievements: first trade, 10% gain, 30-day hold, sector diversity

- Copy trading: mirror top users proportionally

- Portfolio reset (once per 7 days, previous session archived)

- EAS Build → Apple App Store + Google Play Store

- Vercel deploy for web + PWA manifest + OG metadata

**Tests required:**

- Leaderboard ranking calculation

- Achievement unlock conditions

- Copy trade proportional allocation

- Portfolio reset cooldown enforcement

- EAS build configuration validation

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| App framework | React Native + Expo SDK 52 | Web + iOS + Android from one codebase |
| Navigation | Expo Router | File-based, web + native parity |
| Styling | NativeWind v4 | Tailwind for React Native |
| Auth | Firebase Auth | Google OAuth via expo-auth-session |
| Database | Firestore | Real-time listeners for portfolio sync |
| Backend | Firebase Cloud Functions | Order execution, P&L, leaderboard |
| State | Zustand + React Query | Global state + API caching |
| Charting | TradingView Lightweight Charts | Via WebView on mobile |
| Notifications | Expo Push Notifications | Abstracts APNs + FCM |
| Testing | Jest + RNTL + Detox | Unit, component, integration |
| CI/CD | GitHub Actions | All agents run on every PR |
| Web hosting | Vercel | Zero-config Expo web deploys |
| Mobile distribution | EAS Build | App Store + Play Store |

---

## APIs

| API | Purpose | Pricing |
|---|---|---|
| Polygon.io | Live prices, WebSocket ticks, OHLCV, fundamentals, news | Free tier (dev); Starter $29/mo (real-time) |
| Firebase Auth | Google OAuth, session management | Free |
| Firestore + Cloud Functions | Real-time database + server logic | Spark free; Blaze for functions |
| Expo Push Notifications | iOS + Android push alerts | Free |
| TradingView Lightweight Charts | Candlestick charting library | Open source (Apache 2.0) |

---

## Hosting

| Service | Role |
|---|---|
| Vercel | Web frontend — zero-config Expo web, edge CDN, branch previews |
| Firebase (GCP) | Backend + database — Firestore, Cloud Functions, Auth |
| EAS (Expo App Services) | Mobile builds + OTA updates + store submission |

---

## Success Metrics

| Metric | Target |
|---|---|
| DAU / MAU ratio | ≥ 20% |
| Trades per session | ≥ 2 |
| Watchlist adoption | ≥ 60% of registered users |
| Chart session time | ≥ 3 min average |

---

# Agent System

## Overview

TickrX uses 9 agents. The Developer Agent is the orchestrator — it writes all code and opens PRs, which automatically triggers the full pipeline. All agents are synchronized via GitHub Actions.

```
PR opened by Developer Agent
        │
        ▼
Component Memory Agent (injects registry context)
        │
        ▼
┌───────────────────────────────┐
│  TEST    │  LINT   │ SECURITY │  ← run in parallel (Step 3)
└───────────────────────────────┘
        │
        ▼
Code Review Agent (reads all Step 3 results + component registry)
        │
        ▼
Preview Build Agent (only if all above pass)
        │
        ▼
   Merge allowed
        │
        ▼
Changelog Agent + Component Memory Agent updates registry
```

---

## Agent 1 — Developer Agent

**ID:** `agent/developer`

**Role:** Orchestrator — writes all code and opens PRs

### Responsibilities

- Read `COMPONENT_REGISTRY.md` before writing any component

- Implement features per PRD and approved Phase 0 wireframes

- Write Jest + RNTL tests alongside every feature (tests are not optional)

- Open a PR using `gh pr create` — this triggers all downstream agents automatically

- Self-fix when Test Agent or Code Review Agent flags blocking issues

- Register any new reusable components to `COMPONENT_REGISTRY.md` after merge

### Self-Healing Loop

1. Test Agent fails → Developer Agent reads failure output → fixes code → pushes commit → pipeline re-runs

2. Code Review Agent posts blocking issues → Developer Agent reads comments → applies fixes → pushes commit

### Claude Code Prompt Template

```
You are the Developer Agent for TickrX.

Before writing any code:
1. Read COMPONENT_REGISTRY.md — reuse existing components, do not recreate them
2. Read the PRD section for this phase
3. Read the relevant Phase 0 wireframe screen

Then:
4. Implement the feature using existing components wherever possible
5. Write Jest + React Native Testing Library tests for every function and component
6. Ensure all tests pass locally before opening a PR
7. Run: gh pr create --title "[Phase X] Feature name" --body "Closes #issue"
8. If new reusable components were created, update COMPONENT_REGISTRY.md

Task: [INSERT FEATURE DESCRIPTION HERE]
```

### Tools

- Claude Code CLI

- GitHub CLI (`gh`)

- Expo CLI

- Jest + React Native Testing Library

- `COMPONENT_REGISTRY.md`

---

## Agent 2 — Component Memory Agent

**ID:** `agent/component-memory`

**Role:** Shared component registry — prevents duplication across all phases

### How It Works

Maintains `COMPONENT_REGISTRY.md` in the repo root. Every reusable component built by the Developer Agent is logged here with its name, file path, TypeScript props interface, usage example, and which screens use it.

All agents read this file. The Code Review Agent will block any PR that re-implements a component already in the registry.

### Triggers

- **On PR open** — injects registry context into the pipeline for Code Review Agent

- **On merge to main** — scans the merged diff for new components and updates the registry

- **Weekly** — audits for stale or unused entries

### COMPONENT_REGISTRY.md Format

```markdown
# TickrX Component Registry

## [ComponentName]

- **File:** `components/ComponentName.tsx`
- **Props:**
  ```typescript
  interface ComponentNameProps {
    prop1: string;
    prop2: number;
    prop3?: () => void;
  }
  ```
- **Usage:**
  ```tsx
  <ComponentName prop1="value" prop2={42} />
  ```
- **Used in:** Screen1, Screen2, Screen3
- **Last updated:** YYYY-MM-DD
- **Author:** Developer Agent / [human]
```

### Seeded Components (from Phase 0 design system)

| Component | File | Used In |
|---|---|---|
| `TickerRow` | `components/TickerRow.tsx` | Watchlist, Home, Markets |
| `PriceBadge` | `components/PriceBadge.tsx` | StockDetail, Portfolio, Leaderboard |
| `OrderTicket` | `components/OrderTicket.tsx` | StockDetail, Portfolio |
| `SparklineChart` | `components/SparklineChart.tsx` | Watchlist, Home, Leaderboard |
| `CandleChart` | `components/CandleChart.tsx` | StockDetail |
| `SectionHeader` | `components/SectionHeader.tsx` | Home, Markets, Portfolio |
| `StatCard` | `components/StatCard.tsx` | Portfolio, Profile, Dashboard |
| `TabBar` | `components/TabBar.tsx` | All screens |
| `AvatarBadge` | `components/AvatarBadge.tsx` | Profile, Leaderboard |
| `AlertToast` | `components/AlertToast.tsx` | Global |

### GitHub Actions Workflow

```yaml
# .github/workflows/component-memory.yml
name: Component Memory Agent

on:
  pull_request:
    types: [opened, synchronize]
  push:
    branches: [main]

jobs:
  inject-registry:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Post registry summary to PR
        run: |
          gh pr comment ${{ github.event.pull_request.number }} \
            --body "$(cat COMPONENT_REGISTRY.md)"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  update-registry:
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Scan merged diff for new components
        run: node scripts/scan-components.js
      - name: Commit registry update
        run: |
          git config user.name "Component Memory Agent"
          git config user.email "agent@tickrx.app"
          git add COMPONENT_REGISTRY.md
          git diff --staged --quiet || git commit -m "chore: update component registry"
          git push
```

### Tools

- `COMPONENT_REGISTRY.md`

- GitHub Actions

- Claude API (diff scanner)

- `ts-morph` (AST parser for component detection)

---

## Agent 3 — Test Agent

**ID:** `agent/test-runner`

**Role:** Runs full test suite on every PR · blocks merge on failure

### Rules

- Every feature PR must include tests — no exceptions

- Coverage threshold: **80% minimum** — PR blocked if below

- Runs in **parallel** with Lint and Security agents (Step 3)

- Posts coverage report as a PR comment

- Failure triggers Developer Agent self-fix loop

### Test Stack

- **Unit tests:** Jest

- **Component tests:** React Native Testing Library (RNTL)

- **Integration tests:** Detox (CI)

- **Coverage:** Istanbul (built into Jest)

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Agent

on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Run tests with coverage
        run: npx jest --coverage --coverageThreshold='{"global":{"lines":80}}'
      - name: Post coverage report
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const coverage = fs.readFileSync('coverage/coverage-summary.json', 'utf8');
            const data = JSON.parse(coverage).total;
            const body = `## Test Coverage Report\n` +
              `| Metric | % |\n|---|---|\n` +
              `| Lines | ${data.lines.pct}% |\n` +
              `| Statements | ${data.statements.pct}% |\n` +
              `| Functions | ${data.functions.pct}% |\n` +
              `| Branches | ${data.branches.pct}% |`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body
            });
```

### Jest Config

```js
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterFramework: ['@testing-library/jest-native/extend-expect'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: { lines: 80, functions: 80, branches: 75, statements: 80 },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

---

## Agent 4 — Lint & Format Agent

**ID:** `agent/lint-format`

**Role:** Enforces code style on every PR · auto-commits formatting fixes

### Rules

- Runs in **parallel** with Test and Security agents (Step 3)

- Auto-commits Prettier formatting fixes back to the PR branch

- Blocks only on unfixable ESLint errors

- Auto-push of formatting fixes re-triggers the full pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/lint.yml
name: Lint & Format Agent

on:
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          ref: ${{ github.head_ref }}
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Run Prettier
        run: npx prettier --write .
      - name: Run ESLint
        run: npx eslint . --ext .ts,.tsx --max-warnings 0
      - name: Commit formatting fixes
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'style: auto-format by Lint Agent'
```

### ESLint Config

```js
// .eslintrc.js
module.exports = {
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-native/all',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-native/no-inline-styles': 'warn',
    'import/order': ['error', { 'newlines-between': 'always' }],
  },
};
```

---

## Agent 5 — Security Agent

**ID:** `agent/security-scan`

**Role:** CVE scanning, secret detection, Firestore rules validation

### Blocking Behaviour

- Critical CVE → **hard block PR**

- Exposed API key or secret → **hard block PR**

- Firestore rule regression → **hard block PR**

- High severity CVE → warning comment (not blocking)

### GitHub Actions Workflow

```yaml
# .github/workflows/security.yml
name: Security Agent

on:
  pull_request:

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: npm audit (critical + high)
        run: npm audit --audit-level=critical
      - name: Secret scan with gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Validate Firestore rules
        run: npx firebase-tools firestore:rules --project tickrx-app --check
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

---

## Agent 6 — Code Review Agent

**ID:** `agent/pr-reviewer`

**Role:** AI-powered PR review using Claude API · runs after Step 3 agents

### Rules

- Waits for Test, Lint, and Security to complete before running (`needs:` in GitHub Actions)

- Reads `COMPONENT_REGISTRY.md` — flags any PR that re-implements an existing component

- Posts structured review as a PR comment: Blocking · Warning · Suggestion

- Blocking comments trigger the Developer Agent self-fix loop

- Human must still approve and merge — this agent does not auto-merge

### GitHub Actions Workflow

```yaml
# .github/workflows/code-review.yml
name: Code Review Agent

on:
  pull_request:

jobs:
  review:
    runs-on: ubuntu-latest
    needs: [test, lint, security]
    steps:
      - uses: actions/checkout@v4
      - name: Get PR diff
        id: diff
        run: |
          git fetch origin ${{ github.base_ref }}
          git diff origin/${{ github.base_ref }}...HEAD > pr.diff
      - name: Read component registry
        run: cat COMPONENT_REGISTRY.md > registry.md
      - name: Claude code review
        run: |
          node scripts/claude-review.js \
            --diff pr.diff \
            --registry registry.md \
            --pr ${{ github.event.pull_request.number }}
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Claude Review Script (`scripts/claude-review.js`)

```js
const Anthropic = require('@anthropic-ai/sdk');
const { execSync } = require('child_process');
const fs = require('fs');

const client = new Anthropic();
const diff = fs.readFileSync('pr.diff', 'utf8');
const registry = fs.readFileSync('registry.md', 'utf8');
const prNumber = process.argv[process.argv.indexOf('--pr') + 1];

async function review() {
  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `You are a senior React Native engineer reviewing a PR for TickrX, a paper trading app.

COMPONENT REGISTRY (existing reusable components — flag if any are re-implemented in this PR):
${registry}

PR DIFF:
${diff}

Review for:
1. Logic bugs and edge cases
2. Missing error handling on async/await calls
3. Hardcoded secrets or API keys
4. TypeScript \`any\` type misuse
5. Components duplicating entries in the registry above
6. Missing or inadequate tests

Format your response as:

## Code Review

### Blocking issues
- [list or "None"]

### Warnings
- [list or "None"]

### Suggestions
- [list or "None"]

### Verdict
PASS or NEEDS WORK`
    }]
  });

  const body = response.content[0].text;
  const verdict = body.includes('NEEDS WORK') ? 'NEEDS WORK' : 'PASS';

  execSync(`gh pr comment ${prNumber} --body "${body.replace(/"/g, '\\"')}"`, {
    env: { ...process.env }
  });

  if (verdict === 'NEEDS WORK') process.exit(1);
}

review();
```

---

## Agent 7 — Preview Build Agent

**ID:** `agent/eas-preview`

**Role:** EAS preview build with QR code on every PR targeting main

### Rules

- Only fires after all Step 3 agents AND Code Review Agent pass

- Skips draft PRs

- Posts QR code as a PR comment for real-device testing via Expo Go

- Re-runs on new commits to the PR

### GitHub Actions Workflow

```yaml
# .github/workflows/preview.yml
name: Preview Build Agent

on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened, ready_for_review]

jobs:
  preview:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    needs: [test, lint, security, review]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Build preview
        id: build
        run: |
          BUILD_URL=$(eas build --platform all --profile preview --non-interactive --json | jq -r '.url')
          echo "build_url=$BUILD_URL" >> $GITHUB_OUTPUT
      - name: Post QR to PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Preview Build Ready\n\nScan with Expo Go to test this branch on a real device.\n\n[Open in Expo](${{ steps.build.outputs.build_url }})`
            });
```

---

## Agent 8 — Dependency Update Agent

**ID:** `agent/dep-updater`

**Role:** Weekly automated dependency updates via Renovate Bot

### Rules

- Patch + minor updates → automated PR, auto-merge if all agents pass

- Major version bumps → PR opened, flagged for manual review with changelog summary

- Renovate PRs trigger the full pipeline just like Developer Agent PRs

### Renovate Config

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"],
  "schedule": ["before 9am on Monday"],
  "automerge": true,
  "automergeType": "pr",
  "packageRules": [
    {
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["major-update", "needs-review"]
    },
    {
      "matchPackagePatterns": ["expo", "firebase"],
      "automerge": false,
      "labels": ["sdk-update", "needs-review"]
    }
  ]
}
```

---

## Agent 9 — Changelog Agent

**ID:** `agent/changelog-gen`

**Role:** Auto-generates CHANGELOG.md on every merge to main

### Rules

- Fires on merge to `main` — not on PR open

- Uses conventional commit messages to categorise: Features, Fixes, Breaking Changes

- Also signals Component Memory Agent to scan the merged diff and update registry

### GitHub Actions Workflow

```yaml
# .github/workflows/changelog.yml
name: Changelog Agent

on:
  push:
    branches: [main]

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install -g conventional-changelog-cli
      - name: Generate changelog
        run: conventional-changelog -p angular -i CHANGELOG.md -s
      - name: Commit changelog
        run: |
          git config user.name "Changelog Agent"
          git config user.email "agent@tickrx.app"
          git add CHANGELOG.md
          git diff --staged --quiet || git commit -m "docs: update changelog"
          git push
      - name: Trigger component registry update
        run: |
          gh workflow run component-memory.yml
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Required GitHub Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API key for Code Review Agent |
| `EXPO_TOKEN` | Expo account token for EAS builds |
| `FIREBASE_TOKEN` | Firebase CLI token for rules validation |
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions |

---

## Repository Structure

```
tickrx/
├── app/                        # Expo Router screens
│   ├── (tabs)/
│   │   ├── index.tsx           # Home
│   │   ├── markets.tsx         # Markets
│   │   ├── portfolio.tsx       # Portfolio
│   │   └── profile.tsx         # Profile
│   ├── stock/[ticker].tsx      # Stock detail
│   └── _layout.tsx
├── components/                 # Reusable components (see COMPONENT_REGISTRY.md)
│   ├── TickerRow.tsx
│   ├── PriceBadge.tsx
│   ├── OrderTicket.tsx
│   ├── SparklineChart.tsx
│   ├── CandleChart.tsx
│   ├── SectionHeader.tsx
│   ├── StatCard.tsx
│   ├── TabBar.tsx
│   ├── AvatarBadge.tsx
│   └── AlertToast.tsx
├── src/
│   ├── agents/                 # Agent scripts
│   │   └── claude-review.js
│   ├── api/                    # Polygon.io + Firebase wrappers
│   ├── hooks/                  # React Query hooks
│   ├── store/                  # Zustand stores
│   └── types/                  # TypeScript interfaces
├── scripts/
│   ├── claude-review.js        # Code Review Agent script
│   └── scan-components.js      # Component Memory Agent scanner
├── functions/                  # Firebase Cloud Functions
│   ├── src/
│   │   ├── orders.ts           # Order execution + P&L
│   │   ├── leaderboard.ts      # Leaderboard aggregation
│   │   └── alerts.ts           # Price alert checks
├── __tests__/                  # Test files mirror src structure
├── .github/
│   └── workflows/
│       ├── test.yml
│       ├── lint.yml
│       ├── security.yml
│       ├── code-review.yml
│       ├── preview.yml
│       ├── changelog.yml
│       └── component-memory.yml
├── COMPONENT_REGISTRY.md       # Shared component memory
├── CHANGELOG.md
├── renovate.json
├── jest.config.js
├── .eslintrc.js
└── app.json
```

---

*TickrX PRD v3.0 — Generated by Claude · Ready for Claude Code*
