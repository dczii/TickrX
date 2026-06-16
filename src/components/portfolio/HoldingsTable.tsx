"use client";

import { useRouter } from "next/navigation";

import type { Holding } from "@/lib/demoData";
import { formatUsd } from "@/lib/markets";
import DataTable, { type Column } from "@/components/markets/DataTable";
import ChangeChip from "@/components/markets/ChangeChip";

export interface HoldingRow extends Holding {
  avgCost: number;
  allocation: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
  totalValue: number;
}

export default function HoldingsTable({ holdings, totalValue }: HoldingsTableProps) {
  const router = useRouter();

  const rows: HoldingRow[] = holdings.map((h) => ({
    ...h,
    avgCost: h.shares > 0 ? (h.value - h.pnl) / h.shares : 0,
    allocation: totalValue > 0 ? (h.value / totalValue) * 100 : 0,
  }));

  const columns: Column<HoldingRow>[] = [
    {
      key: "symbol",
      label: "Ticker",
      sortable: true,
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-mono font-semibold text-hi">{r.symbol}</span>
          <span className="text-xs text-dim">{r.name}</span>
        </div>
      ),
    },
    {
      key: "shares",
      label: "Shares",
      sortable: true,
      align: "right",
      render: (r) => <span className="font-mono tabular-nums text-mid">{r.shares}</span>,
    },
    {
      key: "avgCost",
      label: "Avg Cost",
      sortable: true,
      align: "right",
      render: (r) => <span className="font-mono tabular-nums text-mid">{formatUsd(r.avgCost)}</span>,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      align: "right",
      render: (r) => <span className="font-mono tabular-nums text-hi">{formatUsd(r.price)}</span>,
    },
    {
      key: "value",
      label: "Mkt Value",
      sortable: true,
      align: "right",
      render: (r) => <span className="font-mono tabular-nums text-hi">{formatUsd(r.value)}</span>,
    },
    {
      key: "pnl",
      label: "P&L",
      sortable: true,
      align: "right",
      render: (r) => (
        <span className={`font-mono tabular-nums ${r.pnl >= 0 ? "text-accent" : "text-danger"}`}>
          {r.pnl >= 0 ? "+" : "-"}
          {formatUsd(Math.abs(r.pnl))}
        </span>
      ),
    },
    {
      key: "pnlPct",
      label: "P&L %",
      sortable: true,
      align: "right",
      render: (r) => <ChangeChip value={r.pnlPct} />,
    },
    {
      key: "allocation",
      label: "Alloc",
      sortable: true,
      align: "right",
      render: (r) => (
        <span className="font-mono tabular-nums text-mid">{r.allocation.toFixed(1)}%</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(r) => r.symbol}
      initialSortKey="value"
      initialSortDir="desc"
      onRowClick={(r) => router.push(`/stock/${r.symbol}`)}
      caption="Portfolio holdings"
    />
  );
}
