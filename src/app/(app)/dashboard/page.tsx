import { ArrowUpRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { STARTING_BALANCE } from "@/lib/portfolio";

function formatUsd(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("cash_balance, starting_balance")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  const cash = Number(portfolio?.cash_balance ?? STARTING_BALANCE);
  const start = Number(portfolio?.starting_balance ?? STARTING_BALANCE);
  const pnl = cash - start;
  const pnlPct = start > 0 ? (pnl / start) * 100 : 0;
  const up = pnl >= 0;

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dim">Welcome back</p>
          <h1 className="text-xl font-bold tracking-tight text-hi">
            {user?.email?.split("@")[0] ?? "Trader"}
          </h1>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-edge bg-surface p-5">
        <p className="eyebrow">Portfolio Value</p>
        <div className="mt-1 flex items-end justify-between">
          <p className="font-mono text-4xl font-semibold tracking-tight tabular-nums text-hi">
            {formatUsd(cash)}
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs font-semibold tabular-nums ${
              up ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"
            }`}
          >
            <ArrowUpRight size={13} aria-hidden="true" className={up ? "" : "rotate-90"} />
            {up ? "+" : ""}
            {pnlPct.toFixed(2)}%
          </span>
        </div>
        <p className={`mt-1 font-mono text-sm font-semibold ${up ? "text-accent" : "text-danger"}`}>
          {up ? "+" : ""}
          {formatUsd(pnl)} all time
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-edge bg-surface p-5">
          <p className="eyebrow">Cash Balance</p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-hi">
            {formatUsd(cash)}
          </p>
        </div>
        <div className="rounded-xl border border-edge bg-surface p-5">
          <p className="eyebrow">Starting Balance</p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-mid">
            {formatUsd(start)}
          </p>
        </div>
      </div>
    </section>
  );
}
