"use client";

import { useQueryState } from "nuqs";

import TVChart from "@/components/TVChart";
import WatchlistPanel from "@/components/markets/WatchlistPanel";
import { useWatchlist } from "@/components/markets/useWatchlist";

interface WatchlistViewProps {
  userId: string;
  initialWatchlist: string[];
}

export default function WatchlistView({ userId, initialWatchlist }: WatchlistViewProps) {
  const { symbols, remove } = useWatchlist(userId, initialWatchlist);
  const [selected, setSelected] = useQueryState("symbol");

  const active = selected ?? symbols[0] ?? null;

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-100">Watchlist</h1>
      <p className="mt-1 text-sm text-slate-400">Track tickers and view live charts.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <WatchlistPanel
          symbols={symbols}
          selected={active}
          onSelect={(s) => setSelected(s)}
          onRemove={(s) => remove(s)}
        />

        <div className="min-h-[400px] rounded-xl border border-zinc-800 bg-[var(--surface)] p-4">
          {active ? (
            <div className="h-[400px]">
              <TVChart tickr={active} />
            </div>
          ) : (
            <p className="grid h-full place-items-center text-sm text-slate-500">
              Select a ticker to view its chart.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
