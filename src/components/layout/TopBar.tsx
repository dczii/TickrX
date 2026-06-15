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
    <header className="border-b border-zinc-800 bg-[var(--bg)]">
      <TickerTape />
      <div className="flex h-14 items-center gap-4 px-8">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value || null)}
            placeholder="Search ticker…"
            aria-label="Search ticker"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-16 text-sm text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-zinc-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
            ⌘K
          </kbd>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-zinc-900 hover:text-slate-100"
        >
          <Bell size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
