"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { Pick, Crypto10ApiResponse } from "@/types/crypto";
import { Heart, HeartPlus } from "lucide-react";
import { toast } from "sonner";

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

  useEffect(() => {
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
    loadFavorites();
  }, []);

  function addToFavorites(symbol: string) {
    const localFavorites = localStorage.getItem(FAVORITES_KEY);
    let favs: string[] = localFavorites ? JSON.parse(localFavorites) : [];
    if (favs.find((f) => f === symbol)) return; // already in favorites
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favs, symbol]));
    toast.info(`Added (${symbol}) to favorites!`);
  }

  function removeToFavorites(symbol: string) {
    const localFavorites = localStorage.getItem(FAVORITES_KEY);
    let favs: string[] = localFavorites ? JSON.parse(localFavorites) : [];
    favs = favs.filter((f) => f !== symbol);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    toast.info(`Removed (${symbol}) from favorites!`);
  }

  return (
    <>
      {responseData && (
        <div className='mt-6'>Data as of: {format(responseData.timestamp, "PPpp")}</div>
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
          {loading && <div className='p-6 text-sm text-slate-400'>Loading…</div>}
          {favorites.map((r) => (
            <div key={r.symbol} className='grid grid-cols-13 px-4 py-3'>
              <div className='col-span-1 flex items-center'>
                <button
                  type='button'
                  className='text-gray-400 hover:text-gray-50 cursor-pointer hover:scale-110 transition'
                  aria-label='Add to favorites'
                  onClick={() => removeToFavorites(r.symbol)}
                >
                  <Heart />
                </button>
              </div>
              <div className='col-span-3 font-semibold'>{r.symbol}</div>
              <div className='col-span-5 text-slate-300'>{r.name}</div>
              <div className='col-span-2 text-right'>${r.price.toLocaleString()}</div>
              <div
                className={`col-span-2 text-right ${
                  (r.change24h ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {((r.change24h ?? 0) >= 0 ? "+" : "") + (r.change24h ?? 0).toFixed(2)}%
              </div>
            </div>
          ))}
          {rows.map((r) => (
            <div key={r.symbol} className='grid grid-cols-13 px-4 py-3'>
              <div className='col-span-1 flex items-center'>
                <button
                  type='button'
                  className='text-gray-400 hover:text-gray-50 cursor-pointer hover:scale-110 transition'
                  aria-label='Add to favorites'
                  onClick={() => addToFavorites(r.symbol)}
                >
                  <HeartPlus />
                </button>
              </div>
              <div className='col-span-3 font-semibold'>{r.symbol}</div>
              <div className='col-span-5 text-slate-300'>{r.name}</div>
              <div className='col-span-2 text-right'>${r.price.toLocaleString()}</div>
              <div
                className={`col-span-2 text-right ${
                  (r.change24h ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {((r.change24h ?? 0) >= 0 ? "+" : "") + (r.change24h ?? 0).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
