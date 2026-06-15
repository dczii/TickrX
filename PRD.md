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

### Phase 1.5 — Web: Scaffold, Auth & Layout

**Claude Code Prompt:**

```
Build the Next.js 15 (App Router) web shell for TickrX matching the prototype design.
Implement: two-panel layout (240px left sidebar + flex-1 main), Supabase Auth with
Google OAuth, dark terminal aesthetic (#030303 background, slate-900 surfaces, emerald-500
accents, monospace numbers), and sidebar navigation (Home, Markets, Portfolio, Profile,
Settings). Auto-create a $100,000 virtual portfolio row in Supabase on first login.

Before writing any component, read COMPONENT_REGISTRY.md and reuse existing components.
Write Jest + Testing Library tests for every feature. All tests must pass.
Once complete, use `gh pr create --title "[Phase 1.5] Web scaffold & auth" --body "Closes #issue"`.
```

**Layout spec (1440px desktop):**

- Left sidebar: `w-60` fixed, dark charcoal (`bg-zinc-950`), logo + nav links + user avatar at bottom
- Main content: `flex-1 overflow-y-auto`, padded `px-8 py-6`
- Top bar: ticker tape scrolling across full width below sidebar top
- Responsive: sidebar collapses to icon-only at `lg`, full hamburger menu at `md`

**Design tokens (web):**

| Token | Value |
|---|---|
| `--bg` | `#030303` |
| `--surface` | `#0f0f0f` / `zinc-900` |
| `--surface-2` | `slate-800` |
| `--accent-green` | `emerald-500` (`#10b981`) |
| `--accent-red` | `red-500` (`#ef4444`) |
| `--text-primary` | `slate-100` |
| `--text-muted` | `slate-400` |
| `--font-mono` | `Geist Mono` |
| `--border` | `zinc-800` |

**Features:**

- Supabase Auth: Google OAuth + email magic link
- Protected routes via Next.js middleware (`/dashboard`, `/markets`, `/portfolio`, `/profile`)
- Auth redirect: unauthenticated → `/login`, authenticated → `/dashboard`
- Auto-create `portfolios` row in Supabase on first login (`$100,000` virtual balance)
- `<Sidebar>` component: nav links with Lucide icons, active state, user avatar
- `<TopBar>` component: live ticker tape, search input (cmd+k), notifications bell
- `<PageShell>` layout wrapper used by all authenticated pages
- NuqsAdapter for URL-based state (active tab, selected ticker)

**Tests required:**

- Google OAuth redirect flow (mock Supabase)
- Portfolio row auto-creation on first login
- Sidebar renders all nav links with correct icons
- Protected route middleware redirects unauthenticated users
- `<PageShell>` renders sidebar + main slot correctly

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

### Phase 2.5 — Web: Markets & Watchlist

**Claude Code Prompt:**

```
Build the web Markets screen and Watchlist panel for TickrX at /markets and /watchlist.
Implement: full-width data table of top movers (sortable columns), sector heatmap grid,
debounced cmd+k search modal with live Polygon.io results, watchlist sidebar panel with
add/remove, and live price ticks via Polygon.io WebSocket updating cells in-place.
Match the prototype's dark terminal table aesthetic — tight rows, monospace prices,
green/red change badges.

Before writing any component, read COMPONENT_REGISTRY.md and reuse existing components.
Write tests for all features. Open a PR when done.
```

**Page: `/markets`**

- Full-width sortable data table: Ticker | Name | Price | Change % | Volume | Market Cap | 52w High/Low
- Columns sortable client-side with visual sort arrow
- Sector heatmap: 11 GICS sectors as coloured tiles (green→red gradient by day change %)
- Top Gainers / Top Losers tabs: 10-row tables with sparkline thumbnails
- Live price update: WebSocket ticks highlight changed cells with brief green/red flash

**Page: `/watchlist`**

- Two-column layout: watchlist ticker list (left, 360px) + selected ticker mini-chart (right)
- Add ticker via search; remove with hover X button
- Persisted in Supabase `watchlists` table, synced in real-time via Supabase Realtime

**Shared web components:**

- `<DataTable>` — sortable, paginated, keyboard-navigable table primitive
- `<SectorHeatmap>` — CSS grid, colour-coded tiles
- `<SearchModal>` — cmd+k overlay, debounced Polygon.io search, keyboard navigation
- `<PriceTick>` — price cell that flashes on WebSocket update
- `<ChangeChip>` — `+2.4%` / `-1.1%` coloured badge

**Tests required:**

- Markets table renders and sorts by column
- Sector heatmap tile colours match change % ranges
- Search modal opens on cmd+k, filters results on input
- Watchlist add/remove persists to Supabase
- WebSocket price tick updates cell value and triggers flash class

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

### Phase 3.5 — Web: Stock Detail & Charting

**Claude Code Prompt:**

```
Build the web Stock Detail page at /stock/[ticker] for TickrX. Use the three-column layout:
left sidebar (existing), centre panel (TradingView Advanced Chart widget, full height), and
right fixed panel (320px) with order ticket + fundamentals + news feed. Implement timeframe
tabs (1m 5m 15m 1h 4h 1D 1W 1M), indicator toggles (SMA EMA RSI MACD Bollinger VWAP
Volume), and Polygon.io news feed below. Match the dark terminal aesthetic — chart fills
all available height with no padding bleed.

Before writing any component, read COMPONENT_REGISTRY.md and reuse existing components.
Write tests for all features. Open a PR when done.
```

**Page: `/stock/[ticker]`**

Three-column layout at 1440px:
```
[240px sidebar] | [flex-1 chart area] | [320px right panel]
```

**Centre panel — chart area:**

- TradingView Advanced Chart widget (dark theme, `backgroundColor: #030303`)
- Timeframe tab bar: `1m 5m 15m 1h 4h 1D 1W 1M` — clicking updates widget `interval`
- Indicator toggle chips below tab bar: click to add/remove studies on the chart
- Price header above chart: current price (large monospace), change $, change %, day range

**Right panel (320px, `position: sticky top-0`):**

- Ticker header: symbol, company name, exchange badge
- Live price + change (updates via WebSocket)
- Order ticket inline (collapsed by default, expands on Buy/Sell click) — covered fully in Phase 4.5
- Fundamentals accordion: P/E, EPS, Market Cap, Dividend Yield, 52w Range, Earnings Date
- Polygon.io news feed: last 5 articles with thumbnail, headline, source, timestamp

**Web-specific components:**

- `<StockPageHeader>` — price, change, day range across top of chart panel
- `<TimeframeBar>` — tab strip that controls TradingView interval
- `<IndicatorChips>` — toggleable chip row for chart studies
- `<FundamentalsAccordion>` — collapsible fundamentals rows
- `<NewsFeed>` — scrollable list of Polygon.io news items

**Tests required:**

- Timeframe tab click updates TradingView widget interval prop
- Indicator toggle adds/removes study from active list
- Fundamentals data renders with correct field labels
- News feed displays articles sorted newest-first
- Right panel sticks on scroll within the page

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

### Phase 4.5 — Web: Trading Engine & Portfolio

**Claude Code Prompt:**

```
Build the web order ticket and Portfolio page for TickrX. The order ticket lives in the right
panel of /stock/[ticker] — expand it inline (no modal) with Buy/Sell toggle, Market/Limit
toggle, $ or Shares input, estimated total, and one-click Confirm button. Build /portfolio
with a data-table of holdings (sortable by ticker, value, P&L, allocation %), summary stat
cards (Total Value, Cash, Day P&L, Total P&L), a portfolio performance line chart vs S&P 500,
and /trades for the full trade history log.

Before writing any component, read COMPONENT_REGISTRY.md and reuse existing components.
Write tests for all features including order execution. Open a PR when done.
```

**Order ticket (right panel of `/stock/[ticker]`):**

- Buy / Sell toggle (green / red active state)
- Market / Limit order toggle; shows limit price input when Limit selected
- Input by `$` amount or `Shares` — toggle updates the other field in real-time
- Estimated total row, available cash row, fee row (simulated $0)
- `Confirm [Buy/Sell]` button — calls Supabase Edge Function `execute-order`
- After confirm: success toast, position updates in right panel without page reload

**Page: `/portfolio`**

- Four stat cards at top: `Total Value`, `Cash Balance`, `Day P&L`, `Total Return %`
- Portfolio performance chart: line chart (Recharts) — portfolio value vs S&P 500 over time
- Holdings table: Ticker | Shares | Avg Cost | Current Price | Market Value | P&L | P&L % | Allocation % — sortable columns, click row → navigates to `/stock/[ticker]`
- Empty state: illustration + "Place your first trade" CTA button

**Page: `/trades`**

- Full trade history: Date | Ticker | Action | Shares | Price | Total | Realised P&L
- Filterable by ticker, date range, action type
- Export to CSV button

**Web-specific components:**

- `<OrderTicketPanel>` — inline order form in the right panel
- `<StatCard>` — summary metric card (reuse from COMPONENT_REGISTRY if exists)
- `<PortfolioChart>` — Recharts line chart with dual series (portfolio vs benchmark)
- `<HoldingsTable>` — sortable holdings data table
- `<TradeHistoryTable>` — filterable trade log with export

**Tests required:**

- Market order deducts correct balance from Supabase
- Limit order creates pending record, fills at target price
- P&L calculation accuracy (unit tests for edge cases)
- Holdings table sorts by each column correctly
- CSV export generates correct output
- Insufficient funds shows error state without submitting

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

### Phase 5.5 — Web: Social, Gamification & PWA

**Claude Code Prompt:**

```
Build the web Leaderboard page at /leaderboard and full Profile page at /profile/[userId]
for TickrX. Implement: weekly/all-time toggle leaderboard ranked by return %, XP progress
bar and achievement badges grid on the profile page, copy-trade button on leaderboard rows
(mirrors Phase 5 copy-trading logic), and portfolio reset flow. Then configure the Next.js
app as a PWA (manifest, service worker, OG metadata) and deploy to Vercel with branch
preview environments.

Before writing any component, read COMPONENT_REGISTRY.md and reuse existing components.
Write tests for all features. Open a PR when done.
```

**Page: `/leaderboard`**

- Weekly / All-time toggle tabs
- Ranked table: Rank | Avatar | Username | Return % | Total Value | Trades | Copiers | Copy button
- Top 3 rows highlighted with gold/silver/bronze badge treatment
- Copy button opens `<CopyTradeSheet>` drawer (right-side panel, 400px) — amount input + stop-loss + Confirm
- Search/filter bar: filter leaderboard by username

**Page: `/profile/[userId]`**

- Public profile header: avatar, username, join date, Popular Investor badge if earned
- Stats row: Return %, Risk Score, # Copiers, # Following
- XP progress bar with current level and next milestone
- Achievements grid: badge icons (Lucide) + name + unlock date; locked badges shown greyed out
- Recent trades feed: last 10 fills
- "Copy Trader" / "Unfollow" CTA button
- If own profile: Edit Profile button + Portfolio Reset button (with 7-day cooldown enforcement)

**Web-specific components:**

- `<LeaderboardTable>` — ranked table with medal badges on top 3
- `<CopyTradeSheet>` — sliding right panel for configuring a copy
- `<ProfileHeader>` — avatar, username, stats in one row
- `<XPProgressBar>` — animated fill bar with level label
- `<AchievementGrid>` — responsive grid of badge cards (earned vs locked)
- `<ResetPortfolioModal>` — confirm dialog with cooldown remaining display

**PWA & Deployment:**

- `public/manifest.json`: name, icons (192/512), theme colour `#030303`, display `standalone`
- Next.js `next-pwa` or manual service worker via `public/sw.js`
- `next.config.ts` OG metadata: title, description, og:image (`/screens/overview.png`)
- Vercel project: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars set
- Branch preview environments auto-generated by Vercel GitHub integration
- `robots.txt` and `sitemap.xml` generated at build time via `app/sitemap.ts`

**Tests required:**

- Leaderboard ranks users correctly by return % descending
- Weekly vs all-time toggle fetches different time-range data
- Copy trade sheet submits correct allocation to Supabase
- Achievement unlock conditions checked for all 4 achievements
- Portfolio reset enforces 7-day cooldown
- PWA manifest includes required fields and correct icon paths

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

## Future Features (Post-v1 Roadmap)

These features are scoped for future phases after the v1 launch. They are design-approved in concept but not yet scheduled for implementation.

---

### Future Feature 1 — CopyTrader (Paper)

**Priority:** Highest impact · eToro's signature mechanic adapted for paper trading

**Concept:**

eToro's CopyTrader lets users automatically replicate the portfolios and trading strategies of verified investors. In eToro's live version: when you start a copy, your position matches the trader's current allocation at exact percentage allocations of their entire equity; you can copy up to 100 investors simultaneously; you can start, stop, and adjust funds at any time; and a configurable stop-loss limit closes the copy automatically if losses reach a threshold.

**TickrX implementation:**

- Tap any leaderboard trader → **"Copy with $10,000 of virtual cash"**
- Their future paper trades mirror into your portfolio in real-time, proportionally scaled to your copy allocation
- Copy up to 10 traders simultaneously (v1 limit, expandable)
- Adjustable copy amount and stop-loss threshold per trader
- Pause or stop copying at any time, keeping existing positions
- Zero real risk — pure learning and competition mechanic

**Screens affected:**

| Screen | Change |
|---|---|
| Leaderboard | "Copy" button on each trader row |
| Trader profile | Copy config sheet (amount, stop-loss) |
| Portfolio | New "Copying" section — lists active copies with P&L, pause/stop controls |

**Firestore schema additions:**

```
copies/{copyId}
  followerId: string
  leaderId: string
  allocatedAmount: number        // virtual $ allocated to this copy
  stopLossPercent: number        // e.g. 20 = close copy if down 20%
  status: "active" | "paused" | "stopped"
  startedAt: timestamp
  openedTrades: TradeRef[]       // trades opened via this copy
```

**Cloud Function:** `onLeaderTrade` — fires whenever a copied trader executes a trade, proportionally mirrors it into each active follower's portfolio.

---

### Future Feature 2 — Public Trader Profiles + "Popular Investor" Status

**Priority:** High · social layer that gives top performers a reason to keep competing

**Concept:**

In eToro, only vetted "Popular Investors" can be copied. They grow a following and earn up to 1.5% of the assets copying them each month as a cash reward. The program creates a two-sided marketplace: learners get a signal to follow, top traders get recognition and income.

**TickrX implementation:**

The Profile screen expands into a fully public trader profile page. A "Popular Investor" badge is awarded automatically based on performance thresholds. Virtual rewards replace eToro's cash payout.

**Public profile fields:**

| Field | Description |
|---|---|
| Return % | All-time and weekly portfolio return |
| Risk score | Volatility-based score (1–10) derived from trade history |
| # of copiers | Live count of users currently copying this trader |
| Holdings | Current open positions (ticker, allocation %, P&L) |
| Trade history feed | Chronological list of recent fills with outcome |
| Follow button | Subscribe to activity feed without copying |

**Popular Investor thresholds (auto-awarded):**

| Tier | Requirements |
|---|---|
| Rising Star | Top 20% return, ≥ 5 copiers, ≥ 30 days active |
| Popular Investor | Top 10% return, ≥ 25 copiers, ≥ 90 days active |
| Elite Investor | Top 3% return, ≥ 100 copiers, ≥ 180 days active |

**Virtual rewards (replaces eToro cash):**

- Exclusive profile badge and flair
- Bonus XP multiplier on trades
- Free access to future premium seasons
- Cosmetic portfolio themes unlocked

**Screens affected:**

| Screen | Change |
|---|---|
| Profile | Becomes public-facing; add copier count, risk score, trade feed, Follow button |
| Leaderboard | Show Popular Investor badge, copier count, risk score alongside return % |
| Notifications | "X started copying you", "You earned Popular Investor status" |

---

*TickrX PRD v3.0 — Generated by Claude · Ready for Claude Code*
