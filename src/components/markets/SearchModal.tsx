"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import type { TickerSearchResult } from "@/types/markets";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSearch: (query: string) => Promise<TickerSearchResult[]>;
  onSelect: (symbol: string) => void;
  debounceMs?: number;
}

/**
 * Full-screen search sheet, confined to the phone frame. Open/close state is
 * owned by the caller (the Markets header) — opened via a search icon tap or
 * the ⌘K shortcut.
 */
export default function SearchModal({
  open,
  onClose,
  onSearch,
  onSelect,
  debounceMs = 250,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TickerSearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      const found = await onSearch(trimmed);
      setResults(found);
      setActiveIndex(0);
    }, debounceMs);
    return () => clearTimeout(handle);
  }, [query, open, onSearch, debounceMs]);

  const select = useCallback(
    (symbol: string) => {
      onSelect(symbol);
      onClose();
    },
    [onSelect, onClose]
  );

  function onInputKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      select(results[activeIndex].symbol);
    } else if (event.key === "Escape") {
      onClose();
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search tickers"
      className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)]"
      onClick={onClose}
    >
      <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 pb-3 pt-4">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-edge bg-surface-2 px-3 py-2.5">
            <Search size={16} aria-hidden="true" className="text-dim" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search ticker or company…"
              aria-label="Search ticker or company"
              className="flex-1 bg-transparent text-sm text-hi outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-1 text-sm font-semibold text-accent"
          >
            Cancel
          </button>
        </div>
        <ul role="listbox" aria-label="Search results" className="overflow-y-auto">
          {results.map((result, index) => (
            <li key={result.symbol} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(result.symbol)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm ${
                  index === activeIndex ? "bg-surface-2" : ""
                }`}
              >
                <span className="font-mono font-semibold text-hi">{result.symbol}</span>
                <span className="truncate pl-3 text-mid">{result.name}</span>
              </button>
            </li>
          ))}
          {query.trim() && results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-dim">No matches.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
