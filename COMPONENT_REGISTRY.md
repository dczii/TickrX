# TickrX Component Registry

> Maintained by Agent 2 (Component Memory Agent).  
> **Read this before writing any component.** If what you need is already here, reuse it — do not recreate it. The Code Review Agent will block PRs that duplicate registered components.

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

## PageShell (web)

- **File:** `src/components/layout/PageShell.tsx`
- **Props:**
  ```typescript
  interface PageShellProps {
    children: ReactNode;
    email?: string | null;
    avatarUrl?: string | null;
  }
  ```
- **Usage:**
  ```tsx
  <PageShell email={user.email} avatarUrl={user.avatarUrl}>{children}</PageShell>
  ```
- **Used in:** `src/app/(app)/layout.tsx` — wraps all authenticated web pages
- **Last updated:** 2026-06-15
- **Notes:** Two-panel app shell (Sidebar + TopBar + scrollable `<main>`). Use for every authenticated page. Auth gating lives in the route-group layout, not here.

---

## Sidebar (web)

- **File:** `src/components/layout/Sidebar.tsx`
- **Props:**
  ```typescript
  interface SidebarProps {
    email?: string | null;
    avatarUrl?: string | null;
  }
  ```
- **Usage:**
  ```tsx
  <Sidebar email={user.email} avatarUrl={user.avatarUrl} />
  ```
- **Used in:** PageShell
- **Last updated:** 2026-06-15
- **Notes:** Fixed `w-60` charcoal nav from `NAV_ITEMS` (`src/lib/nav.ts`) with Lucide icons, active-route highlight via `usePathname`, and a sign-out button. Renders inside PageShell — do not mount directly.

---

## TopBar (web)

- **File:** `src/components/layout/TopBar.tsx`
- **Props:** none
- **Usage:**
  ```tsx
  <TopBar />
  ```
- **Used in:** PageShell
- **Last updated:** 2026-06-15
- **Notes:** TradingView ticker tape + cmd/ctrl+K search input (URL state via `nuqs` `q` param) + notifications bell. Reuses `TickerTape`.

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
- **Used in:** Markets, Portfolio, Settings pages
- **Last updated:** 2026-06-15
- **Notes:** Dashed-border empty state for not-yet-built sections. Replace with real content as later phases land.

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
