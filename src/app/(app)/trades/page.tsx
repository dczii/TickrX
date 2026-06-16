import { DEMO_HISTORY } from "@/lib/demoData";
import { formatUsd } from "@/lib/markets";
import ScreenHeader from "@/components/layout/ScreenHeader";
import Avatar from "@/components/ui/Avatar";

export default function TradesPage() {
  return (
    <section>
      <ScreenHeader back title="Trade History" />

      <div className="px-5 space-y-6">
        {DEMO_HISTORY.map((group) => (
          <div key={group.date}>
            <h2 className="eyebrow mb-2">{group.date}</h2>
            <div className="divide-y divide-[var(--border-soft)] rounded-2xl border border-edge bg-surface">
              {group.rows.map((row, i) => {
                const win = row.pnl >= 0;
                return (
                  <div key={`${row.symbol}-${i}`} className="flex items-center gap-3 px-4 py-3">
                    <Avatar initials={row.symbol.slice(0, 2)} hue={row.hue} size={34} />
                    <div className="flex-1">
                      <p className="font-mono text-sm font-semibold text-hi">{row.symbol}</p>
                      <p className="text-xs text-dim">
                        <span className={row.side === "BUY" ? "text-accent" : "text-danger"}>
                          {row.side}
                        </span>{" "}
                        {row.shares} @ {formatUsd(row.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm tabular-nums text-hi">
                        {formatUsd(row.total)}
                      </p>
                      <p
                        className={`font-mono text-xs font-semibold tabular-nums ${
                          win ? "text-accent" : "text-danger"
                        }`}
                      >
                        {win ? "+" : "-"}
                        {formatUsd(Math.abs(row.pnl))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
