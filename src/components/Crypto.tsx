"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { Pick, Crypto10ApiResponse } from "@/types/crypto";
import { toast } from "sonner";
import RowLoader from "./RowLoader";

import TickerRow from "./crypto/TickerRow";

const FAVORITES_KEY = "tickrx-favorites";

export default function Crypto() {
  const [rows, setRows] = useState<Pick[]>([]);
  const [favorites, setFavorites] = useState<Pick[]>([]);
  const [responseData, setResponseData] = useState<Crypto10ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/crypto", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Crypto10ApiResponse = await res.json();
      setResponseData(data);
      setRows(data?.picks || []);
      setLoading(false);
    };
    load();
  }, []);

  const loadFavorites = async () => {
    const localFavorites = localStorage.getItem(FAVORITES_KEY);

    if (!localFavorites) return;
    const res = await fetch("/api/crypto-by-symbol", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbols: localFavorites || [] }),
    });
    const data: Crypto10ApiResponse = await res.json();

    setFavorites(data.picks);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  function addToFavorites(symbol: string) {
    const localFavorites = localStorage.getItem(FAVORITES_KEY);
    let favs: string[] = localFavorites ? JSON.parse(localFavorites) : [];
    if (favs.find((f) => f === symbol)) return; // already in favorites
    const combined = [...favs, symbol];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(combined));
    toast.info(`Added (${symbol}) to favorites!`);
    loadFavorites();
  }

  function removeToFavorites(symbol: string) {
    const localFavorites = localStorage.getItem(FAVORITES_KEY);
    let favs: string[] = localFavorites ? JSON.parse(localFavorites) : [];
    favs = favs.filter((f) => f !== symbol);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    setFavorites((prev) => prev.filter((f) => f.symbol !== symbol));
    toast.info(`Removed (${symbol}) from favorites!`);
  }

  return (
    <>
      {responseData && (
        <div className='mt-6'>Data as of: {format(responseData?.timestamp, "PPpp")}</div>
      )}
      <div className='rounded-2xl border border-slate-800 bg-slate-900/50 mt-3'>
        <div className='grid grid-cols-13 text-xs uppercase tracking-wide text-slate-400 px-4 py-3'>
          {/* No title for favorite column */}
          <div className='col-span-1'></div>
          <div className='col-span-3'>Symbol</div>
          <div className='col-span-5'>Name</div>
          <div className='col-span-2 text-right'>Price</div>
          <div className='col-span-2 text-right'>24h %</div>
        </div>
        <div className='divide-y divide-slate-800'>
          {loading && (
            <div className='grid grid-cols-13 px-4 py-3 h-10'>
              <div className='col-span-1'></div>
              <div className='col-span-3'>
                <RowLoader />
              </div>
              <div className='col-span-5'>
                <RowLoader />
              </div>
              <div className='col-span-2'>
                <RowLoader className='justify-end' />
              </div>
              <div className='col-span-2'>
                <RowLoader className='justify-end' />
              </div>
            </div>
          )}
          {/* Favorites */}
          {favorites.map((r) => (
            <TickerRow
              key={`fav-${r.symbol}`}
              item={r}
              isFavorite={true}
              onToggleFavorite={removeToFavorites}
            />
          ))}

          {/* Non-favorites */}
          {rows.map((r) => (
            <TickerRow
              key={r.symbol}
              item={r}
              isFavorite={false}
              onToggleFavorite={addToFavorites}
            />
          ))}
        </div>
      </div>
    </>
  );
}
