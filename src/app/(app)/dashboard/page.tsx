import Link from "next/link";
import { ArrowUpRight, Bell, ChevronRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { STARTING_BALANCE } from "@/lib/portfolio";
import { formatUsd, formatPercent } from "@/lib/markets";
import { getWatchlist } from "@/lib/watchlist";
import { DEMO_GAINERS, DEMO_LOSERS } from "@/lib/demoData";
import ScreenHeader from "@/components/layout/ScreenHeader";
import AreaChart from "@/components/charts/AreaChart";
import Sparkline from "@/components/charts/Sparkline";
import Avatar from "@/components/ui/Avatar";

const TOP_MOVERS = [DEMO_GAINERS[0], DEMO_GAINERS[1], DEMO_LOSERS[0]];

function seedFor(symbol: string): number {
  return symbol.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: portfolio }, watchlist] = await Promise.all([
    supabase
      .from("portfolios")
      .select("cash_balance, starting_balance")
      .eq("user_id", user?.id ?? "")
      .maybeSingle(),
    getWatchlist(supabase, user?.id ?? "").catch(() => [] as string[]),
  ]);

  const cash = Number(portfolio?.cash_balance ?? STARTING_BALANCE);
  const start = Number(portfolio?.starting_balance ?? STARTING_BALANCE);
  const pnl = cash - start;
  const pnlPct = start > 0 ? (pnl / start) * 100 : 0;
  const up = pnl >= 0;
  const name = user?.email?.split("@")[0] ?? "Trader";

  return (
    <section>
      <ScreenHeader
        title={name}
        subtitle="Good morning"
        right={
          <>
            <Bell size={20} aria-hidden="true" className="text-mid" />
            <Avatar initials={name.slice(0, 2).toUpperCase()} />
          </>
        }
      />

      <div className="px-5">
      <div className="mt-1 overflow-hidden rounded-2xl border border-edge bg-surface">
        <div className="flex items-start justify-between px-5 pt-5">
          <div>
            <p className="eyebrow">Portfolio Value</p>
            <p className="mt-1 font-mono text-4xl font-semibold tracking-tight tabular-nums text-hi">
              {formatUsd(cash)}
            </p>
            <p
              className={`mt-1 font-mono text-sm font-semibold ${up ? "text-accent" : "text-danger"}`}
            >
              {up ? "+" : ""}
              {formatUsd(pnl)} all time
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs font-semibold tabular-nums ${
              up ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"
            }`}
          >
            <ArrowUpRight size={13} aria-hidden="true" className={up ? "" : "rotate-90"} />
            {formatPercent(pnlPct)}
          </span>
        </div>
        <div className="mt-3">
          <AreaChart seed={11} positive={up} height={120} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="eyebrow mb-3">Top Movers</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {TOP_MOVERS.map((m) => {
            const positive = m.changePct >= 0;
            return (
              <Link
                key={m.symbol}
                href={`/stock/${m.symbol}`}
                className="w-32 shrink-0 rounded-xl border border-edge bg-surface p-3 transition-colors hover:border-mid"
              >
                <p className="font-mono text-sm font-semibold text-hi">{m.symbol}</p>
                <div className="my-1">
                  <Sparkline seed={seedFor(m.symbol)} positive={positive} width={104} height={28} />
                </div>
                <p className="font-mono text-[13px] font-semibold tabular-nums text-hi">
                  {formatUsd(m.price)}
                </p>
                <p
                  className={`font-mono text-[11.5px] font-semibold ${positive ? "text-accent" : "text-danger"}`}
                >
                  {formatPercent(m.changePct)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="eyebrow">Watchlist</h2>
          <Link
            href="/watchlist"
            className="inline-flex items-center text-xs font-semibold text-accent"
          >
            See all <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
        {watchlist.length === 0 ? (
          <p className="rounded-xl border border-edge bg-surface px-4 py-6 text-sm text-dim">
            No tickers yet. Star a ticker in Markets to add one.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border-soft)] rounded-xl border border-edge bg-surface">
            {watchlist.slice(0, 5).map((symbol) => (
              <Link
                key={symbol}
                href={`/stock/${symbol}`}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-surface-2"
              >
                <span className="font-mono text-sm font-semibold text-hi">{symbol}</span>
                <Sparkline seed={seedFor(symbol)} width={80} height={24} />
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
