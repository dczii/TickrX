"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import type { TickerSearchResult } from "@/types/markets";

interface SearchModalProps {
  onSearch: (query: string) => Promise<TickerSearchResult[]>;
  onSelect: (symbol: string) => void;
  debounceMs?: number;
}

export default function SearchModal({ onSearch, onSelect, debounceMs = 250 }: SearchModalProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TickerSearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
      setOpen(false);
    },
    [onSelect]
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-32"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-edge bg-[var(--surface)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-edge px-4">
          <Search size={16} aria-hidden="true" className="text-dim" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search ticker or company…"
            aria-label="Search ticker or company"
            className="flex-1 bg-transparent py-3 text-sm text-hi outline-none"
          />
        </div>
        <ul role="listbox" aria-label="Search results" className="max-h-72 overflow-y-auto">
          {results.map((result, index) => (
            <li key={result.symbol} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(result.symbol)}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm ${
                  index === activeIndex ? "bg-surface" : ""
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
