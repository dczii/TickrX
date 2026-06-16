# TickrX Component Registry

> Maintained by Agent 2 (Component Memory Agent).  
> **Read this before writing any component.** If what you need is already here, reuse it — do not recreate it. The Code Review Agent will block PRs that duplicate registered components.

---

## DataTable (web)

- **File:** `src/components/markets/DataTable.tsx`
- **Props:**
  ```typescript
  interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    align?: "left" | "right";
    render?: (row: T) => ReactNode;
  }
  interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    rowKey: (row: T) => string;
    initialSortKey?: keyof T;
    initialSortDir?: "asc" | "desc";
    onRowClick?: (row: T) => void;
    caption?: string;
  }
  ```
- **Usage:**
  ```tsx
  <DataTable columns={columns} rows={rows} rowKey={(r) => r.symbol} initialSortKey="changePct" />
  ```
- **Used in:** MarketsTable
- **Last updated:** 2026-06-15
- **Notes:** Generic client-side sortable table primitive. Click a sortable header to sort; toggles asc/desc. Sets `aria-sort`. Use for all tabular data.

---

## ChangeChip (web)

- **File:** `src/components/markets/ChangeChip.tsx`
- **Props:** `{ value: number; showIcon?: boolean }`
- **Usage:**
  ```tsx
  <ChangeChip value={2.4} />
  ```
- **Used in:** MarketsTable
- **Last updated:** 2026-06-15
- **Notes:** `+2.40%` / `-1.10%` coloured badge (emerald up / red down) with Lucide arrow. Use for every percentage-change display.

---

## PriceTick (web)

- **File:** `src/components/markets/PriceTick.tsx`
- **Props:** `{ price: number; flashDuration?: number }`
- **Usage:**
  ```tsx
  <PriceTick price={229.87} />
  ```
- **Used in:** MarketsTable
- **Last updated:** 2026-06-15
- **Notes:** Monospace price cell that flashes green/red for ~600ms when the value changes (live WebSocket ticks). Sets `data-flash="up|down|none"`.

---

## SectorHeatmap (web)

- **File:** `src/components/markets/SectorHeatmap.tsx`
- **Props:** `{ sectors: { name: string; changePct: number }[] }`
- **Usage:**
  ```tsx
  <SectorHeatmap sectors={sectors} />
  ```
- **Used in:** MarketsView
- **Last updated:** 2026-06-15
- **Notes:** CSS-grid tiles coloured by `heatmapColor()` (green→red by day change %). 11 GICS sectors.

---

## SearchModal (web)

- **File:** `src/components/markets/SearchModal.tsx`
- **Props:**
  ```typescript
  interface SearchModalProps {
    open: boolean;
    onClose: () => void;
    onSearch: (query: string) => Promise<{ symbol: string; name: string }[]>;
    onSelect: (symbol: string) => void;
    debounceMs?: number;
  }
  ```
- **Usage:**
  ```tsx
  <SearchModal open={open} onClose={() => setOpen(false)} onSearch={searchTickers} onSelect={onSelect} />
  ```
- **Used in:** MarketsView
- **Last updated:** 2026-06-16
- **Notes:** Full-screen sheet (not a centered dialog) confined to the phone frame via `PhoneShell`'s containing-block trick. Open/close owned by the caller; MarketsView owns the single ⌘K listener and the search-icon trigger. Debounced search, arrow-key navigation, Escape/backdrop/Cancel to close. Do NOT add a second ⌘K listener elsewhere.

---

## WatchlistPanel (web)

- **File:** `src/components/markets/WatchlistPanel.tsx`
- **Props:** `{ symbols: string[]; selected?: string | null; onSelect: (s) => void; onRemove: (s) => void }`
- **Used in:** MarketsView, WatchlistView
- **Last updated:** 2026-06-15
- **Notes:** Presentational watchlist list with hover-X remove. State/persistence comes from the `useWatchlist(userId, initial)` hook (`src/components/markets/useWatchlist.ts`), which wraps `src/lib/watchlist.ts` + Supabase Realtime.

---

## TickerRow

- **File:** `src/components/crypto/TickerRow.tsx`
- **Props:**
  ```typescript
  interface Props {
    item: Ticker;
    isFavorite: boolean;
    onToggleFavorite: (symbol: string, next: boolean) => void;
  }
  ```
- **Usage:**
  ```tsx
  <TickerRow item={ticker} isFavorite={false} onToggleFavorite={handleToggle} />
  ```
- **Used in:** Crypto
- **Last updated:** 2026-06-08
- **Notes:** Uses `lucide-react` for Heart/ArrowUpRight/ArrowDownRight icons. Memoized.

---

## TickrXSpinner

- **File:** `src/components/TickrXSpinner.tsx`
- **Props:**
  ```typescript
  interface TickrXSpinnerProps {
    size?: number;    // px, default 32
    accent?: string;  // Tailwind text color class, default "text-emerald-400"
    className?: string;
  }
  ```
- **Usage:**
  ```tsx
  <TickrXSpinner size={24} accent="text-emerald-400" />
  ```
- **Used in:** StockAnalysis
- **Last updated:** 2026-06-08
- **Notes:** Framer Motion rotating arc. Use for all loading states.

---

## RowLoader

- **File:** `src/components/RowLoader.tsx`
- **Props:**
  ```typescript
  interface RowLoaderProps {
    className?: string;
  }
  ```
- **Usage:**
  ```tsx
  <RowLoader className="w-full" />
  ```
- **Used in:** Crypto, Stocks
- **Last updated:** 2026-06-08
- **Notes:** Pulse skeleton for table/list rows.

---

## Header

- **File:** `src/components/Header.tsx`
- **Props:** none
- **Usage:**
  ```tsx
  <Header />
  ```
- **Used in:** Global layout
- **Last updated:** 2026-06-08
- **Notes:** Renders TickrX logo, redirects to `/` on click.

---

## TVChart

- **File:** `src/components/TVChart.tsx`
- **Props:**
  ```typescript
  interface Props {
    tickr: string;  // ticker symbol e.g. "AAPL"
  }
  ```
- **Usage:**
  ```tsx
  <TVChart tickr="AAPL" />
  ```
- **Used in:** stock/[tickr]
- **Last updated:** 2026-06-08
- **Notes:** Embeds TradingView advanced chart widget via script injection. Dark theme, no side toolbar.

---

## TVAnalysis

- **File:** `src/components/TVAnalysis.tsx`
- **Props:**
  ```typescript
  interface Props {
    tickr: string;
  }
  ```
- **Usage:**
  ```tsx
  <TVAnalysis tickr="AAPL" />
  ```
- **Used in:** stock/[tickr]
- **Last updated:** 2026-06-08
- **Notes:** Embeds TradingView technical analysis widget. 450px height, dark theme.

---

## TVNews

- **File:** `src/components/TVNews.tsx`
- **Props:**
  ```typescript
  interface Props {
    tickr: string;
  }
  ```
- **Usage:**
  ```tsx
  <TVNews tickr="AAPL" />
  ```
- **Used in:** stock/[tickr]
- **Last updated:** 2026-06-08
- **Notes:** Embeds TradingView timeline/news widget. 550px height, dark theme.

---

## TickerTape

- **File:** `src/components/TickrTape.tsx`
- **Props:** none
- **Usage:**
  ```tsx
  <TickerTape />
  ```
- **Used in:** Home page
- **Last updated:** 2026-06-08
- **Notes:** TradingView scrolling ticker tape. Symbols include SPX, NDX, EURUSD, BTCUSD, gold, oil.

---

## AskStock

- **File:** `src/components/AskStock.tsx`
- **Props:**
  ```typescript
  interface Props {
    stock: string;  // ticker symbol
  }
  ```
- **Usage:**
  ```tsx
  <AskStock stock="AAPL" />
  ```
- **Used in:** stock/[tickr]
- **Last updated:** 2026-06-08
- **Notes:** AI Q&A for a given ticker via `/api/ask-stock`. Letter-by-letter animated answer using framer-motion.

---

## StockAnalysis

- **File:** `src/components/StockAnalysis.tsx`
- **Props:**
  ```typescript
  interface Props {
    tickr: string;
  }
  ```
- **Usage:**
  ```tsx
  <StockAnalysis tickr="AAPL" />
  ```
- **Used in:** stock/[tickr]
- **Last updated:** 2026-06-08
- **Notes:** Fetches analyst data from `/api/stock-analysis`. Uses `sonner` toast on error, `TickrXSpinner` while loading.

---

## Stocks

- **File:** `src/components/Stocks.tsx`
- **Props:** none
- **Usage:**
  ```tsx
  <Stocks />
  ```
- **Used in:** Home page
- **Last updated:** 2026-06-08
- **Notes:** Fetches top stock picks from `/api/stocks/top`. Clickable rows navigate to `/stock/[tickr]`. Uses `sonner` toast on error.

---

## Crypto

- **File:** `src/components/Crypto.tsx`
- **Props:** none
- **Usage:**
  ```tsx
  <Crypto />
  ```
- **Used in:** Home page
- **Last updated:** 2026-06-08
- **Notes:** Fetches top 10 crypto from `/api/crypto`. Favorites persisted in `localStorage` under `tickrx-favorites`. Uses `TickerRow` and `RowLoader`.

---

## PhoneShell (web)

- **File:** `src/components/layout/PhoneShell.tsx`
- **Props:** `{ children: ReactNode }`
- **Usage:**
  ```tsx
  <PhoneShell>{children}</PhoneShell>
  ```
- **Used in:** `src/app/(app)/layout.tsx` — wraps all authenticated web pages
- **Last updated:** 2026-06-16
- **Notes:** Literal phone-frame mockup (bezel, notch, rounded `phone-screen`) matching the TickrX prototype, centered on the page. Bezel chrome only renders at `sm:` (≥640px); below that the screen fills the viewport edge-to-edge since a real mobile browser has its own chrome. `phone-screen` uses `transform-gpu` so any `position: fixed` descendant (the `Toaster`, `SearchModal`'s full-screen sheet) is confined to the frame instead of the whole viewport. Stacks `StatusBar` → scrollable `<main>` → `TabBar` → `Toaster`. Auth gating lives in the route-group layout, not here.

---

## StatusBar (web)

- **File:** `src/components/layout/StatusBar.tsx`
- **Props:** none
- **Usage:**
  ```tsx
  <StatusBar />
  ```
- **Used in:** PhoneShell
- **Last updated:** 2026-06-16
- **Notes:** iOS-style status bar — live local time (updates every 30s) + hand-rolled inline SVG signal/wifi/battery glyphs (decorative OS chrome, not app icons, so plain SVG instead of `lucide-react` here). Hidden below the `sm:` bezel breakpoint. Renders inside PhoneShell — do not mount directly.

---

## TabBar (web)

- **File:** `src/components/layout/TabBar.tsx`
- **Props:** none
- **Usage:**
  ```tsx
  <TabBar />
  ```
- **Used in:** PhoneShell
- **Last updated:** 2026-06-16
- **Notes:** Bottom 4-tab nav (Home/Markets/Portfolio/Profile) from `TAB_ITEMS` (`src/lib/nav.ts`) with Lucide icons, active-route highlight via `usePathname`, plus the home-indicator pill. Renders inside PhoneShell — do not mount directly.

---

## ScreenHeader (web)

- **File:** `src/components/layout/ScreenHeader.tsx`
- **Props:**
  ```typescript
  interface ScreenHeaderProps {
    title: ReactNode;
    subtitle?: ReactNode;
    back?: boolean;
    right?: ReactNode;
  }
  ```
- **Usage:**
  ```tsx
  <ScreenHeader title="Markets" right={<SearchButton />} />
  <ScreenHeader back title="AAPL" />
  ```
- **Used in:** Every `(app)` page — root tabs (Home/Markets/Portfolio/Profile) use `back={false}` with a greeting/title + actions; sub-screens (stock detail, trades, leaderboard, settings, watchlist) use `back` for a chevron + centered title.
- **Last updated:** 2026-06-16
- **Notes:** Shared header pattern matching the prototype. `back` mode calls `router.back()` — always render from a page/component that's reachable via in-app navigation, not a deep link with no history.

---

## SignOutButton (web)

- **File:** `src/components/layout/SignOutButton.tsx`
- **Props:** none
- **Usage:**
  ```tsx
  <SignOutButton />
  ```
- **Used in:** Profile (`/profile`)
- **Last updated:** 2026-06-16
- **Notes:** Calls `signOut()` from `@/lib/auth`, redirects to `/login` on success, `toast.error` on failure.

---

## SectionPlaceholder (web)

- **File:** `src/components/layout/SectionPlaceholder.tsx`
- **Props:**
  ```typescript
  interface SectionPlaceholderProps {
    title: string;
    description: string;
    comingIn: string;
  }
  ```
- **Usage:**
  ```tsx
  <SectionPlaceholder title="Markets" description="Live prices and movers." comingIn="Phase 2.5" />
  ```
- **Used in:** Settings page (Portfolio/Markets now built)
- **Last updated:** 2026-06-16
- **Notes:** Renders `ScreenHeader back` for the title + a dashed-border empty state for not-yet-built sections. Replace with real content as later phases land.

---

## Sparkline (web)

- **File:** `src/components/charts/Sparkline.tsx`
- **Props:** `{ seed: number; positive?: boolean; width?: number; height?: number; fill?: boolean }`
- **Used in:** Dashboard (top movers, watchlist preview)
- **Last updated:** 2026-06-16
- **Notes:** Seeded SVG sparkline mirroring the prototype. Deterministic per `seed`. Green/red by `positive`. Geometry from `src/lib/charts.ts`.

---

## AreaChart (web)

- **File:** `src/components/charts/AreaChart.tsx`
- **Props:** `{ seed?: number; positive?: boolean; width?: number; height?: number; className?: string }`
- **Used in:** Dashboard (portfolio value), Portfolio (performance)
- **Last updated:** 2026-06-16
- **Notes:** Seeded gradient area chart, fills container width. Geometry from `src/lib/charts.ts`. Use for any performance/value-over-time visual until live OHLC is wired.

---

## StatCard (web)

- **File:** `src/components/ui/StatCard.tsx`
- **Props:** `{ label: string; value: ReactNode; sub?: ReactNode; tone?: "up" | "down" | "neutral" }`
- **Used in:** Portfolio (summary cards)
- **Last updated:** 2026-06-16
- **Notes:** Summary metric card with eyebrow label, mono value, toned sub-line. Reuse for Profile stats.

---

## Avatar (web)

- **File:** `src/components/ui/Avatar.tsx`
- **Props:** `{ initials: string; hue?: number; size?: number }`
- **Used in:** Dashboard, Leaderboard, Trades
- **Last updated:** 2026-06-16
- **Notes:** Deterministic HSL-tinted initials badge mirroring the prototype's `Avatar`.

---

## OrderTicketPanel (web)

- **File:** `src/components/stock/OrderTicketPanel.tsx`
- **Props:** `{ symbol: string; price: number; buyingPower: number }`
- **Used in:** Stock detail right panel (`/stock/[ticker]`)
- **Last updated:** 2026-06-16
- **Notes:** Inline buy/sell ticket — market/limit toggle, $/shares input, est. shares/total, insufficient-funds guard, confirm fires a sonner toast. Swap the confirm handler for the Supabase `execute-order` Edge Function in Phase 4.5.

---

## StockChartPanel (web)

- **File:** `src/components/stock/StockChartPanel.tsx`
- **Props:** `{ symbol: string; name: string; price: number; changePct: number }`
- **Used in:** Stock detail (`/stock/[ticker]`)
- **Last updated:** 2026-06-16
- **Notes:** Price header + timeframe tab bar (1m…1M) that drives the `TVChart` `interval` prop. Reuses `TVChart`.

---

## Fundamentals (web)

- **File:** `src/components/stock/Fundamentals.tsx`
- **Props:** `{ symbol: string; price: number }`
- **Used in:** Stock detail right panel
- **Last updated:** 2026-06-16
- **Notes:** Static demo fundamentals list. Replace values with Polygon fundamentals in Phase 3.5.

---

## HoldingsTable (web)

- **File:** `src/components/portfolio/HoldingsTable.tsx`
- **Props:** `{ holdings: Holding[]; totalValue: number }`
- **Used in:** Portfolio (`/portfolio`)
- **Last updated:** 2026-06-16
- **Notes:** Sortable holdings table built on `DataTable`. Computes avg cost + allocation %. Row click → `/stock/[ticker]`. Reuses `DataTable`, `ChangeChip`.

---

## LeaderboardView (web)

- **File:** `src/components/leaderboard/LeaderboardView.tsx`
- **Props:** `{ leaders: Leader[] }`
- **Used in:** Leaderboard (`/leaderboard`)
- **Last updated:** 2026-06-16
- **Notes:** Weekly/all-time toggle, medal treatment for top 3, current-user highlight, copy button (fires toast). Reuses `Avatar`. Wire copy to Supabase in Phase 5.5.

---

## ScreenShell (mobile)

- **File:** `apps/mobile/src/components/ScreenShell.tsx`
- **Props:**
  ```typescript
  interface ScreenShellProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
  }
  ```
- **Usage:**
  ```tsx
  <ScreenShell title="Markets" subtitle="Search, movers, and sectors">{children}</ScreenShell>
  ```
- **Used in:** Home, Markets, Portfolio, Profile tab screens
- **Last updated:** 2026-06-11
- **Notes:** Safe-area screen wrapper with dark-terminal header. Use for every tab screen in the Expo app.

---

## AuthProvider (mobile)

- **File:** `apps/mobile/src/providers/AuthProvider.tsx`
- **Props:**
  ```typescript
  interface AuthContextValue {
    session: Session | null;
    isLoading: boolean;
  }
  ```
- **Usage:**
  ```tsx
  <AuthProvider>{children}</AuthProvider>
  // const { session, isLoading } = useAuth();
  ```
- **Used in:** Root layout; consumed by login screen and tab layout auth gate
- **Last updated:** 2026-06-11
- **Notes:** Restores persisted Supabase session on mount and subscribes to auth state changes. Never read `supabase.auth` directly in components — use `useAuth()`.

---

## Preferred Libraries (check before writing custom)

| Need | Library | Already installed |
|---|---|---|
| UI primitives | [reactnativereusables.com](https://reactnativereusables.com/) | No — install when needed |
| Icons | `lucide-react` | ✅ Yes |
| Toasts | `sonner` | ✅ Yes |
| Drawers / sheets | `vaul` | No — install when needed |
| Animation | `framer-motion` | ✅ Yes |
