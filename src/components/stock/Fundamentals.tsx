interface FundamentalsProps {
  symbol: string;
  price: number;
}

/**
 * Static demo fundamentals. Polygon fundamentals are wired in Phase 3.5;
 * until then these mirror the prototype's detail panel layout.
 */
export default function Fundamentals({ price }: FundamentalsProps) {
  const rows: Array<[string, string]> = [
    ["P/E Ratio", "28.4"],
    ["EPS", "6.13"],
    ["Market Cap", "3.22T"],
    ["Dividend Yield", "0.42%"],
    ["52w Range", `${(price * 0.6).toFixed(2)} – ${(price * 1.1).toFixed(2)}`],
    ["Earnings Date", "Aug 28"],
  ];

  return (
    <div className="rounded-xl border border-edge bg-surface p-4">
      <h2 className="eyebrow mb-3">Fundamentals</h2>
      <dl className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <dt className="text-dim">{label}</dt>
            <dd className="font-mono tabular-nums text-hi">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
