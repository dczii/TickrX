import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Optional sub-line; `tone` colors it green/red/neutral. */
  sub?: ReactNode;
  tone?: "up" | "down" | "neutral";
}

export default function StatCard({ label, value, sub, tone = "neutral" }: StatCardProps) {
  const subColor =
    tone === "up" ? "text-accent" : tone === "down" ? "text-danger" : "text-mid";

  return (
    <div className="min-w-0 rounded-xl border border-edge bg-surface p-4">
      <p className="eyebrow truncate">{label}</p>
      <p className="mt-2 truncate font-mono text-lg font-semibold tabular-nums text-hi">{value}</p>
      {sub ? (
        <p className={`mt-1 truncate font-mono text-sm font-semibold ${subColor}`}>{sub}</p>
      ) : null}
    </div>
  );
}
