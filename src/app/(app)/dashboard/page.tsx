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

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-100">Home</h1>
      <p className="mt-1 text-sm text-slate-400">Your TickrX virtual trading desk.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Cash Balance</p>
          <p className="mt-2 tabular-nums text-2xl font-semibold text-emerald-400">
            {formatUsd(cash)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Starting Balance</p>
          <p className="mt-2 tabular-nums text-2xl font-semibold text-slate-100">
            {formatUsd(Number(portfolio?.starting_balance ?? STARTING_BALANCE))}
          </p>
        </div>
      </div>
    </section>
  );
}
