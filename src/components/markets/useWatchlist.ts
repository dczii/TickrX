"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "@/lib/watchlist";

interface UseWatchlist {
  symbols: string[];
  watched: Set<string>;
  add: (symbol: string) => Promise<void>;
  remove: (symbol: string) => Promise<void>;
  toggle: (symbol: string) => Promise<void>;
}

export function useWatchlist(userId: string, initial: string[]): UseWatchlist {
  const [symbols, setSymbols] = useState<string[]>(initial);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`watchlists:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "watchlists", filter: `user_id=eq.${userId}` },
        async () => {
          try {
            setSymbols(await getWatchlist(supabase, userId));
          } catch {
            // Realtime refresh is best-effort; optimistic state already applied.
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const add = useCallback(
    async (symbol: string) => {
      const normalized = symbol.trim().toUpperCase();
      setSymbols((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
      try {
        await addToWatchlist(createClient(), userId, normalized);
      } catch {
        setSymbols((prev) => prev.filter((s) => s !== normalized));
        toast.error(`Could not add ${normalized}.`);
      }
    },
    [userId]
  );

  const remove = useCallback(
    async (symbol: string) => {
      const normalized = symbol.trim().toUpperCase();
      const prevSymbols = symbols;
      setSymbols((prev) => prev.filter((s) => s !== normalized));
      try {
        await removeFromWatchlist(createClient(), userId, normalized);
      } catch {
        setSymbols(prevSymbols);
        toast.error(`Could not remove ${normalized}.`);
      }
    },
    [symbols, userId]
  );

  const toggle = useCallback(
    async (symbol: string) => {
      const normalized = symbol.trim().toUpperCase();
      if (symbols.includes(normalized)) {
        await remove(normalized);
      } else {
        await add(normalized);
      }
    },
    [symbols, add, remove]
  );

  return { symbols, watched: new Set(symbols), add, remove, toggle };
}
