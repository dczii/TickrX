"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";

import type { MarketRow } from "@/types/markets";
import { formatCompact } from "@/lib/markets";
import DataTable, { type Column } from "@/components/markets/DataTable";
import PriceTick from "@/components/markets/PriceTick";
import ChangeChip from "@/components/markets/ChangeChip";
import { usePriceTicks } from "@/components/markets/usePriceTicks";

interface MarketsTableProps {
  rows: MarketRow[];
  watched: Set<string>;
  onToggleWatch: (symbol: string) => void;
  onSelectSymbol: (symbol: string) => void;
}

export default function MarketsTable({
  rows,
  watched,
  onToggleWatch,
  onSelectSymbol,
}: MarketsTableProps) {
  const symbols = useMemo(() => rows.map((r) => r.symbol), [rows]);
  const initial = useMemo(() => Object.fromEntries(rows.map((r) => [r.symbol, r.price])), [rows]);
  const prices = usePriceTicks(symbols, initial);

  const liveRows = useMemo(
    () => rows.map((r) => ({ ...r, price: prices[r.symbol] ?? r.price })),
    [rows, prices]
  );

  const columns: Column<MarketRow>[] = [
    {
      key: "symbol",
      label: "Ticker",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={watched.has(row.symbol)}
            aria-label={
              watched.has(row.symbol)
                ? `Remove ${row.symbol} from watchlist`
                : `Add ${row.symbol} to watchlist`
            }
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatch(row.symbol);
            }}
            className={
              watched.has(row.symbol) ? "text-amber-400" : "text-slate-600 hover:text-slate-300"
            }
          >
            <Star
              size={14}
              className={watched.has(row.symbol) ? "fill-current" : ""}
              aria-hidden="true"
            />
          </button>
          <span className="font-mono font-semibold text-slate-100">{row.symbol}</span>
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row) => <span className="text-slate-400">{row.name}</span>,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      align: "right",
      render: (row) => <PriceTick price={row.price} />,
    },
    {
      key: "changePct",
      label: "Change",
      sortable: true,
      align: "right",
      render: (row) => <ChangeChip value={row.changePct} />,
    },
    {
      key: "volume",
      label: "Volume",
      sortable: true,
      align: "right",
      render: (row) => formatCompact(row.volume),
    },
    {
      key: "marketCap",
      label: "Mkt Cap",
      sortable: true,
      align: "right",
      render: (row) => formatCompact(row.marketCap),
    },
    {
      key: "high52",
      label: "52w H/L",
      align: "right",
      render: (row) => (
        <span className="font-mono text-xs tabular-nums text-slate-400">
          {row.high52.toFixed(2)} / {row.low52.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={liveRows}
      rowKey={(row) => row.symbol}
      initialSortKey="changePct"
      initialSortDir="desc"
      onRowClick={(row) => onSelectSymbol(row.symbol)}
      caption="Market movers"
    />
  );
}
