"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { formatUsd, formatPercent } from "@/lib/markets";
import TVChart from "@/components/TVChart";

interface StockChartPanelProps {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
}

const TIMEFRAMES: Array<{ label: string; interval: string }> = [
  { label: "1m", interval: "1" },
  { label: "5m", interval: "5" },
  { label: "15m", interval: "15" },
  { label: "1h", interval: "60" },
  { label: "4h", interval: "240" },
  { label: "1D", interval: "D" },
  { label: "1W", interval: "W" },
  { label: "1M", interval: "M" },
];

export default function StockChartPanel({ symbol, name, price, changePct }: StockChartPanelProps) {
  const [interval, setInterval] = useState("D");
  const up = changePct >= 0;
  const changeAbs = (price * changePct) / 100;

  return (
    <div className="rounded-2xl border border-edge bg-surface">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-edge px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xl font-bold text-hi">{symbol}</h1>
            <span className="text-sm text-mid">{name}</span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <span className="font-mono text-3xl font-semibold tabular-nums text-hi">
              {formatUsd(price)}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-sm font-semibold tabular-nums ${
                up ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"
              }`}
            >
              <ArrowUpRight size={14} aria-hidden="true" className={up ? "" : "rotate-90"} />
              {up ? "+" : "-"}
              {formatUsd(Math.abs(changeAbs))} ({formatPercent(changePct)})
            </span>
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Chart timeframe"
        className="flex gap-1 border-b border-edge px-3 py-2"
      >
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.interval}
            type="button"
            role="tab"
            aria-selected={interval === tf.interval}
            onClick={() => setInterval(tf.interval)}
            className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
              interval === tf.interval ? "bg-surface-3 text-accent" : "text-mid hover:text-hi"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      <div className="p-2">
        <TVChart tickr={symbol} interval={interval} height={460} />
      </div>
    </div>
  );
}
