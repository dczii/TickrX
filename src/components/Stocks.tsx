"use client";

import { useEffect, useState } from "react";
import type { StockPick, StocksApiResponse } from "@/types/stocks";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Stocks() {
  const [stocks, setStocks] = useState<StockPick[] | null>(null);
  const [data, setData] = useState<StocksApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/stocks/top");
        if (!res.ok) throw new Error("Failed to fetch");
        const json: StocksApiResponse = await res.json();
        setStocks(json.picks || []);
        setData(json);
      } catch (err) {
        toast.error("Something went wrong loading stocks.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className='overflow-x-auto rounded-lg shadow-md'>
      {data && <div className='mt-6'>Data as of: {format(data?.generated_at, "PPpp")}</div>}
      <table className='min-w-full rounded-lg border-collapse bg-slate-900 text-slate-100 mt-3 overflow-hidden'>
        <thead>
          <tr className='bg-slate-800 text-left text-sm uppercase text-slate-400'>
            <th className='px-4 py-3'>Name</th>
            <th className='px-4 py-3'>Symbol</th>
            <th className='px-4 py-3'>Price</th>
            <th className='px-4 py-3'>Suggestion</th>
          </tr>
        </thead>
        <tbody>
          {stocks &&
            stocks.map((stock, idx) => (
              <tr
                key={idx}
                className='border-t border-slate-700 hover:bg-slate-800/60 cursor-pointer'
              >
                <td className='px-4 py-2 font-medium'>{stock.name}</td>
                <td className='px-4 py-2'>{stock.symbol}</td>
                <td className='px-4 py-2'>${Number(stock.current_price).toLocaleString()}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    stock.suggestion === "BUY"
                      ? "text-emerald-400"
                      : stock.suggestion === "SELL"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {stock.suggestion}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
