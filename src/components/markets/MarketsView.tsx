"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Search } from "lucide-react";

import type { MarketRow, Sector, TickerSearchResult } from "@/types/markets";
import { topMovers } from "@/lib/markets";
import ScreenHeader from "@/components/layout/ScreenHeader";
import SectorHeatmap from "@/components/markets/SectorHeatmap";
import MarketsTable from "@/components/markets/MarketsTable";
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
  const router = useRouter();
  const { watched, toggle } = useWatchlist(userId, initialWatchlist);
  const [view, setView] = useQueryState("view", { defaultValue: "all" });
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const rows =
    view === "gainers"
      ? topMovers(initialRows, "gainers")
      : view === "losers"
        ? topMovers(initialRows, "losers")
        : initialRows;

  const onSelectSymbol = useCallback(
    (symbol: string) => router.push(`/stock/${symbol}`),
    [router]
  );

  return (
    <section>
      <ScreenHeader
        title="Markets"
        right={
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search ticker"
            className="text-mid transition-colors hover:text-hi"
          >
            <Search size={20} aria-hidden="true" />
          </button>
        }
      />

      <div className="px-5">
        <h2 className="eyebrow mb-2">Sector Heatmap</h2>
        <SectorHeatmap sectors={sectors} />

        <div className="mt-6 mb-3 inline-flex rounded-lg bg-surface-2 p-1">
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

        <div className="-mx-5 overflow-x-auto px-5 pb-4">
          <MarketsTable
            rows={rows}
            watched={watched}
            onToggleWatch={(s) => toggle(s)}
            onSelectSymbol={onSelectSymbol}
          />
        </div>
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={searchTickers}
        onSelect={onSelectSymbol}
      />
    </section>
  );
}
