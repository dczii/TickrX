import "server-only";

import type { MarketRow, TickerSearchResult } from "@/types/markets";
import { mapSnapshot, mockMarketRows } from "@/lib/markets";

const POLYGON_BASE = "https://api.polygon.io";

function apiKey(): string | undefined {
  return process.env.POLYGON_API_KEY;
}

/**
 * Full-market snapshot of US stocks. Falls back to deterministic mock data
 * when no POLYGON_API_KEY is configured so the Markets page still renders.
 */
export async function getMarketSnapshot(): Promise<MarketRow[]> {
  const key = apiKey();
  if (!key) {
    return mockMarketRows();
  }

  try {
    const res = await fetch(
      `${POLYGON_BASE}/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=${key}`,
      { next: { revalidate: 15 } }
    );
    if (!res.ok) {
      return mockMarketRows();
    }
    const json = (await res.json()) as { tickers?: Parameters<typeof mapSnapshot>[0] };
    const rows = mapSnapshot(json.tickers ?? []);
    return rows.length > 0 ? rows : mockMarketRows();
  } catch {
    return mockMarketRows();
  }
}

/** Ticker search for the cmd+k modal. Mock-filters the snapshot without a key. */
export async function searchTickers(query: string): Promise<TickerSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const key = apiKey();
  if (!key) {
    const q = trimmed.toUpperCase();
    return mockMarketRows()
      .filter((r) => r.symbol.includes(q) || r.name.toUpperCase().includes(q))
      .map((r) => ({ symbol: r.symbol, name: r.name }));
  }

  try {
    const res = await fetch(
      `${POLYGON_BASE}/v3/reference/tickers?search=${encodeURIComponent(trimmed)}&active=true&limit=10&apiKey=${key}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      return [];
    }
    const json = (await res.json()) as {
      results?: Array<{ ticker: string; name: string }>;
    };
    return (json.results ?? []).map((r) => ({ symbol: r.ticker, name: r.name }));
  } catch {
    return [];
  }
}
