/**
 * Demo fixtures mirroring the prototype's `D` dataset (TickrX_Prototype.html).
 * These back the trading surfaces that don't yet have a live engine — holdings,
 * movers, leaderboard, trade history — so the web matches the prototype until
 * Phases 4.5/5.5 wire them to Supabase + Polygon.
 */

export interface Holding {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  shares: number;
  value: number;
  pnl: number;
  pnlPct: number;
  hue: number;
}

export interface Mover {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  hue: number;
}

export interface TradeRow {
  symbol: string;
  side: "BUY" | "SELL";
  shares: number;
  price: number;
  total: number;
  pnl: number;
  hue: number;
}

export interface TradeGroup {
  date: string;
  rows: TradeRow[];
}

export interface Leader {
  rank: number;
  name: string;
  handle: string;
  returnPct: number;
  hue: number;
  initials: string;
  me?: boolean;
}

export const DEMO_PORTFOLIO = {
  value: 127438.52,
  dayChg: 2184.3,
  dayPct: 1.74,
  allChg: 27438.52,
  allPct: 27.44,
  buyingPower: 8420.16,
};

export const DEMO_HOLDINGS: Holding[] = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: 1284.55, changePct: 3.42, shares: 18, value: 23121.9, pnl: 4210.4, pnlPct: 22.3, hue: 120 },
  { symbol: "AAPL", name: "Apple Inc", price: 228.14, changePct: 1.18, shares: 64, value: 14600.96, pnl: 1820.55, pnlPct: 14.2, hue: 210 },
  { symbol: "TSLA", name: "Tesla Inc", price: 342.88, changePct: -2.74, shares: 40, value: 13715.2, pnl: -980.2, pnlPct: -6.7, hue: 8 },
  { symbol: "MSFT", name: "Microsoft Corp", price: 472.3, changePct: 0.62, shares: 22, value: 10390.6, pnl: 1140.1, pnlPct: 12.3, hue: 200 },
  { symbol: "AMD", name: "Adv Micro Devices", price: 168.42, changePct: 4.85, shares: 55, value: 9263.1, pnl: 2310.75, pnlPct: 33.2, hue: 24 },
  { symbol: "SPY", name: "S&P 500 ETF", price: 598.77, changePct: 0.41, shares: 12, value: 7185.24, pnl: 412.3, pnlPct: 6.1, hue: 260 },
];

export const DEMO_GAINERS: Mover[] = [
  { symbol: "COIN", name: "Coinbase Global", price: 284.91, changePct: 6.18, hue: 220 },
  { symbol: "AMD", name: "Adv Micro Dev", price: 168.42, changePct: 4.85, hue: 24 },
  { symbol: "NVDA", name: "NVIDIA Corp", price: 1284.55, changePct: 3.42, hue: 120 },
  { symbol: "PLTR", name: "Palantir Tech", price: 42.18, changePct: 2.07, hue: 190 },
];

export const DEMO_LOSERS: Mover[] = [
  { symbol: "TSLA", name: "Tesla Inc", price: 342.88, changePct: -2.74, hue: 8 },
  { symbol: "META", name: "Meta Platforms", price: 648.2, changePct: -1.32, hue: 230 },
  { symbol: "NKE", name: "Nike Inc", price: 74.02, changePct: -1.08, hue: 40 },
  { symbol: "DIS", name: "Walt Disney", price: 112.4, changePct: -0.86, hue: 280 },
];

export const DEMO_WATCHLIST_PREVIEW: Mover[] = [
  { symbol: "AAPL", name: "Apple Inc", price: 228.14, changePct: 1.18, hue: 210 },
  { symbol: "NVDA", name: "NVIDIA Corp", price: 1284.55, changePct: 3.42, hue: 120 },
  { symbol: "TSLA", name: "Tesla Inc", price: 342.88, changePct: -2.74, hue: 8 },
  { symbol: "COIN", name: "Coinbase Global", price: 284.91, changePct: 6.18, hue: 220 },
];

export const DEMO_HISTORY: TradeGroup[] = [
  {
    date: "Today",
    rows: [
      { symbol: "AMD", side: "BUY", shares: 25, price: 166.1, total: 4152.5, pnl: 580.0, hue: 24 },
      { symbol: "TSLA", side: "SELL", shares: 15, price: 348.2, total: 5223.0, pnl: -210.4, hue: 8 },
    ],
  },
  {
    date: "Jun 6",
    rows: [
      { symbol: "NVDA", side: "BUY", shares: 8, price: 1242.0, total: 9936.0, pnl: 340.4, hue: 120 },
      { symbol: "COIN", side: "SELL", shares: 30, price: 271.4, total: 8142.0, pnl: 1240.0, hue: 220 },
      { symbol: "AAPL", side: "BUY", shares: 20, price: 224.5, total: 4490.0, pnl: 72.8, hue: 210 },
    ],
  },
  {
    date: "Jun 5",
    rows: [
      { symbol: "SPY", side: "BUY", shares: 12, price: 594.1, total: 7129.2, pnl: 56.0, hue: 260 },
      { symbol: "MSFT", side: "SELL", shares: 10, price: 468.9, total: 4689.0, pnl: -44.2, hue: 200 },
    ],
  },
];

export interface Quote {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
}

/** Best-effort demo quote for a symbol, scanning the fixtures above. */
export function quoteFor(symbol: string): Quote {
  const sym = symbol.toUpperCase();
  const pools: Array<{ symbol: string; name: string; price: number; changePct: number }> = [
    ...DEMO_HOLDINGS,
    ...DEMO_GAINERS,
    ...DEMO_LOSERS,
    ...DEMO_WATCHLIST_PREVIEW,
  ];
  const hit = pools.find((q) => q.symbol === sym);
  return hit
    ? { symbol: sym, name: hit.name, price: hit.price, changePct: hit.changePct }
    : { symbol: sym, name: sym, price: 100, changePct: 0 };
}

export const DEMO_LEADERS: Leader[] = [
  { rank: 1, name: "Maya Okonkwo", handle: "@mayatrades", returnPct: 94.2, hue: 340, initials: "MO" },
  { rank: 2, name: "Diego Santos", handle: "@dsantos", returnPct: 81.7, hue: 40, initials: "DS" },
  { rank: 3, name: "Priya Nair", handle: "@priyatrades", returnPct: 73.5, hue: 280, initials: "PN" },
  { rank: 4, name: "Liam Chen", handle: "@liamc", returnPct: 62.1, hue: 200, initials: "LC" },
  { rank: 5, name: "Sofia Rossi", handle: "@sofiar", returnPct: 58.9, hue: 160, initials: "SR" },
  { rank: 6, name: "Noah Williams", handle: "@noahw", returnPct: 51.3, hue: 60, initials: "NW" },
  { rank: 14, name: "Alex Tran", handle: "@alextrades", returnPct: 38.4, hue: 158, initials: "AT", me: true },
];
