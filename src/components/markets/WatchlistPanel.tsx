"use client";

import { X } from "lucide-react";

interface WatchlistPanelProps {
  symbols: string[];
  selected?: string | null;
  onSelect: (symbol: string) => void;
  onRemove: (symbol: string) => void;
}

export default function WatchlistPanel({
  symbols,
  selected,
  onSelect,
  onRemove,
}: WatchlistPanelProps) {
  return (
    <div className="rounded-xl border border-edge bg-[var(--surface)]">
      <div className="border-b border-edge px-4 py-3">
        <h2 className="text-sm font-semibold text-hi">Watchlist</h2>
      </div>
      {symbols.length === 0 ? (
        <p className="px-4 py-6 text-sm text-dim">
          No tickers yet. Star a row or search to add one.
        </p>
      ) : (
        <ul aria-label="Watchlist tickers">
          {symbols.map((symbol) => (
            <li
              key={symbol}
              className={`group flex items-center justify-between px-4 py-2 hover:bg-surface ${
                selected === symbol ? "bg-surface" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(symbol)}
                className="flex-1 text-left font-mono text-sm font-semibold text-hi"
              >
                {symbol}
              </button>
              <button
                type="button"
                aria-label={`Remove ${symbol} from watchlist`}
                onClick={() => onRemove(symbol)}
                className="text-faint opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
