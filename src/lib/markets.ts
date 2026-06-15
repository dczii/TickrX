import type { MarketRow, Sector, SortDirection } from "@/types/markets";

export const GICS_SECTORS = [
  "Information Technology",
  "Health Care",
  "Financials",
  "Consumer Discretionary",
  "Communication Services",
  "Industrials",
  "Consumer Staples",
  "Energy",
  "Utilities",
  "Real Estate",
  "Materials",
] as const;

/**
 * Maps a day-change percentage to a heatmap background class.
 * Green for gains, red for losses, intensity by magnitude.
 */
export function heatmapColor(changePct: number): string {
  if (changePct >= 2) return "bg-emerald-600";
  if (changePct >= 0.5) return "bg-emerald-700";
  if (changePct > 0) return "bg-emerald-900";
  if (changePct === 0) return "bg-zinc-700";
  if (changePct > -0.5) return "bg-red-900";
  if (changePct > -2) return "bg-red-700";
  return "bg-red-600";
}

export function sortRows<T extends MarketRow>(
  rows: T[],
  key: keyof MarketRow,
  direction: SortDirection
): T[] {
  const factor = direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === "number" && typeof bv === "number") {
      return (av - bv) * factor;
    }
    return String(av).localeCompare(String(bv)) * factor;
  });
}

export function topMovers(rows: MarketRow[], kind: "gainers" | "losers", count = 10): MarketRow[] {
  const sorted = sortRows(rows, "changePct", kind === "gainers" ? "desc" : "asc");
  return sorted.slice(0, count);
}

export function formatPrice(value: number): string {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCompact(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return String(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

interface PolygonSnapshotTicker {
  ticker: string;
  todaysChangePerc?: number;
  day?: { c?: number; v?: number };
  prevDay?: { c?: number; v?: number };
  min?: { c?: number };
}

/**
 * Maps a Polygon.io snapshot payload into normalized MarketRow values.
 * Tolerant of partial data — missing fields default to 0.
 */
export function mapSnapshot(tickers: PolygonSnapshotTicker[]): MarketRow[] {
  return tickers.map((t) => {
    const price = t.min?.c ?? t.day?.c ?? t.prevDay?.c ?? 0;
    return {
      symbol: t.ticker,
      name: t.ticker,
      price,
      changePct: t.todaysChangePerc ?? 0,
      volume: t.day?.v ?? 0,
      marketCap: 0,
      high52: 0,
      low52: 0,
    };
  });
}

const MOCK_BASE: Array<Omit<MarketRow, "changePct">> = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 229.87,
    volume: 48_210_000,
    marketCap: 3.5e12,
    high52: 237.23,
    low52: 164.08,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 441.58,
    volume: 19_400_000,
    marketCap: 3.28e12,
    high52: 468.35,
    low52: 362.9,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 131.26,
    volume: 241_900_000,
    marketCap: 3.22e12,
    high52: 140.76,
    low52: 75.61,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 201.2,
    volume: 33_500_000,
    marketCap: 2.1e12,
    high52: 215.9,
    low52: 145.68,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 176.49,
    volume: 21_100_000,
    marketCap: 2.16e12,
    high52: 191.75,
    low52: 127.9,
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 563.33,
    volume: 12_800_000,
    marketCap: 1.43e12,
    high52: 602.95,
    low52: 313.66,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.98,
    volume: 71_300_000,
    marketCap: 794e9,
    high52: 278.98,
    low52: 138.8,
  },
  {
    symbol: "AVGO",
    name: "Broadcom Inc.",
    price: 168.23,
    volume: 18_900_000,
    marketCap: 786e9,
    high52: 185.16,
    low52: 96.0,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 220.45,
    volume: 8_200_000,
    marketCap: 627e9,
    high52: 225.48,
    low52: 153.0,
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
    price: 82.51,
    volume: 15_600_000,
    marketCap: 663e9,
    high52: 84.5,
    low52: 49.85,
  },
];

let mockSeed = 1;
function pseudoRandom(): number {
  mockSeed = (mockSeed * 9301 + 49297) % 233280;
  return mockSeed / 233280;
}

/** Deterministic mock movers used when no Polygon API key is configured. */
export function mockMarketRows(): MarketRow[] {
  mockSeed = 1;
  return MOCK_BASE.map((r) => ({
    ...r,
    changePct: Number((pseudoRandom() * 8 - 4).toFixed(2)),
  }));
}

export function mockSectors(): Sector[] {
  mockSeed = 99;
  return GICS_SECTORS.map((name) => ({
    name,
    changePct: Number((pseudoRandom() * 6 - 3).toFixed(2)),
  }));
}
