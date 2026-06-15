"use client";

import { useEffect, useRef } from "react";
import { Bell, Search } from "lucide-react";
import { useQueryState } from "nuqs";

import { TickerTape } from "@/components/TickrTape";

export default function TopBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="border-b border-edge bg-[var(--bg)]">
      <TickerTape />
      <div className="flex h-14 items-center gap-4 px-8">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value || null)}
            placeholder="Search ticker…"
            aria-label="Search ticker"
            className="w-full rounded-lg border border-edge bg-surface py-2 pl-9 pr-16 text-sm text-hi outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-edge px-1.5 py-0.5 font-mono text-[10px] text-dim">
            ⌘K
          </kbd>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg p-2 text-mid transition-colors hover:bg-surface hover:text-hi"
        >
          <Bell size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
