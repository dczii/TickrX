"use client";

import { useCallback } from "react";
import { useQueryState } from "nuqs";

import type { MarketRow, Sector, TickerSearchResult } from "@/types/markets";
import { topMovers } from "@/lib/markets";
import SectorHeatmap from "@/components/markets/SectorHeatmap";
import MarketsTable from "@/components/markets/MarketsTable";
import WatchlistPanel from "@/components/markets/WatchlistPanel";
import SearchModal from "@/components/markets/SearchModal";
import { useWatchlist } from "@/components/markets/useWatchlist";

interface MarketsViewProps {
  userId: string;
  initialRows: MarketRow[];
  sectors: Sector[];
  initialWatchlist: string[];
}

const TABS = [
  { id: "all", label: "All" },
  { id: "gainers", label: "Top Gainers" },
  { id: "losers", label: "Top Losers" },
] as const;

async function searchTickers(query: string): Promise<TickerSearchResult[]> {
  const res = await fetch(`/api/markets/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const json = (await res.json()) as { results: TickerSearchResult[] };
  return json.results;
}

export default function MarketsView({
  userId,
  initialRows,
  sectors,
  initialWatchlist,
}: MarketsViewProps) {
  const { symbols, watched, toggle, remove } = useWatchlist(userId, initialWatchlist);
  const [view, setView] = useQueryState("view", { defaultValue: "all" });
  const [selected, setSelected] = useQueryState("symbol");

  const rows =
    view === "gainers"
      ? topMovers(initialRows, "gainers")
      : view === "losers"
        ? topMovers(initialRows, "losers")
        : initialRows;

  const onSelectSymbol = useCallback((symbol: string) => setSelected(symbol), [setSelected]);

  return (
    <section>
      <SearchModal onSearch={searchTickers} onSelect={(s) => toggle(s)} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-hi">Markets</h1>
        <p className="text-xs text-dim">
          Press <kbd className="rounded border border-edge px-1 font-mono">⌘K</kbd> to search
        </p>
      </div>

      <div className="mt-6">
        <h2 className="eyebrow mb-2">Sector Heatmap</h2>
        <SectorHeatmap sectors={sectors} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="rounded-xl border border-edge bg-[var(--surface)] p-4">
          <div className="mb-3 inline-flex rounded-lg bg-surface-2 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id === "all" ? null : tab.id)}
                aria-pressed={view === tab.id}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  view === tab.id ? "bg-surface-3 text-accent" : "text-mid hover:text-hi"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <MarketsTable
              rows={rows}
              watched={watched}
              onToggleWatch={(s) => toggle(s)}
              onSelectSymbol={onSelectSymbol}
            />
          </div>
        </div>

        <WatchlistPanel
          symbols={symbols}
          selected={selected}
          onSelect={onSelectSymbol}
          onRemove={(s) => remove(s)}
        />
      </div>
    </section>
  );
}
