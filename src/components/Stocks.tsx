"use client";

import { useEffect, useState } from "react";

type Row = { symbol: string; name: string; price: number; change24h?: number };

export default function Stocks() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/stock10");
      setRows(await res.json());
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className='rounded-2xl border border-slate-800 bg-slate-900/50 mt-6'>
      <div className='grid grid-cols-12 text-xs uppercase tracking-wide text-slate-400 px-4 py-3'>
        <div className='col-span-3'>Symbol</div>
        <div className='col-span-5'>Name</div>
        <div className='col-span-2 text-right'>Price</div>
        <div className='col-span-2 text-right'>Change %</div>
      </div>
      <div className='divide-y divide-slate-800'>
        {loading && <div className='p-6 text-sm text-slate-400'>Loading…</div>}
        {rows.map((r) => (
          <div key={r.symbol} className='grid grid-cols-12 px-4 py-3'>
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
  );
}
