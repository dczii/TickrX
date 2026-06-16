import Link from "next/link";

import { formatUsd, formatPercent } from "@/lib/markets";
import { DEMO_PORTFOLIO, DEMO_HOLDINGS } from "@/lib/demoData";
import ScreenHeader from "@/components/layout/ScreenHeader";
import StatCard from "@/components/ui/StatCard";
import AreaChart from "@/components/charts/AreaChart";
import HoldingsTable from "@/components/portfolio/HoldingsTable";

export default function PortfolioPage() {
  const p = DEMO_PORTFOLIO;
  const holdingsValue = DEMO_HOLDINGS.reduce((sum, h) => sum + h.value, 0);
  const cash = p.value - holdingsValue;
  const dayUp = p.dayChg >= 0;
  const totalUp = p.allChg >= 0;
  const empty = DEMO_HOLDINGS.length === 0;

  return (
    <section>
      <ScreenHeader
        title="Portfolio"
        subtitle="Holdings, performance, allocation"
        right={
          <span className="rounded-md bg-surface-2 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-dim">
            Demo
          </span>
        }
      />

      <div className="px-5">
        <div className="mt-1 grid grid-cols-2 gap-3">
          <StatCard label="Total Value" value={formatUsd(p.value)} />
          <StatCard label="Cash Balance" value={formatUsd(cash)} />
          <StatCard
            label="Day P&L"
            value={`${dayUp ? "+" : "-"}${formatUsd(Math.abs(p.dayChg))}`}
            sub={formatPercent(p.dayPct)}
            tone={dayUp ? "up" : "down"}
          />
          <StatCard
            label="Total Return"
            value={formatPercent(p.allPct)}
            sub={`${totalUp ? "+" : "-"}${formatUsd(Math.abs(p.allChg))}`}
            tone={totalUp ? "up" : "down"}
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-edge bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="eyebrow">Performance</h2>
            <span className="font-mono text-xs text-dim">vs S&amp;P 500</span>
          </div>
          <div className="mt-3">
            <AreaChart seed={7} positive={totalUp} height={180} />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="eyebrow mb-3">Holdings</h2>
          {empty ? (
            <div className="rounded-2xl border border-edge bg-surface px-6 py-16 text-center">
              <p className="text-sm text-mid">No positions yet.</p>
              <Link
                href="/markets"
                className="mt-4 inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent"
              >
                Place your first trade
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-edge bg-surface p-2">
              <HoldingsTable holdings={DEMO_HOLDINGS} totalValue={p.value} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
