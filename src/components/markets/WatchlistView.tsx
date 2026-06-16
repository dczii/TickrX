"use client";

import { useQueryState } from "nuqs";

import ScreenHeader from "@/components/layout/ScreenHeader";
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
      <ScreenHeader back title="Watchlist" />

      <div className="px-5">
        <WatchlistPanel
          symbols={symbols}
          selected={active}
          onSelect={(s) => setSelected(s)}
          onRemove={(s) => remove(s)}
        />

        <div className="mt-4 min-h-[300px] rounded-xl border border-edge bg-[var(--surface)] p-4">
          {active ? (
            <div className="h-[300px]">
              <TVChart tickr={active} />
            </div>
          ) : (
            <p className="grid h-full place-items-center text-sm text-dim">
              Select a ticker to view its chart.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
