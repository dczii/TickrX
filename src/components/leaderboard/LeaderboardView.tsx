"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { Leader } from "@/lib/demoData";
import { formatPercent } from "@/lib/markets";
import ScreenHeader from "@/components/layout/ScreenHeader";
import Avatar from "@/components/ui/Avatar";

interface LeaderboardViewProps {
  leaders: Leader[];
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardView({ leaders }: LeaderboardViewProps) {
  const [range, setRange] = useState<"weekly" | "all">("all");

  return (
    <section>
      <ScreenHeader back title="Leaderboard" />

      <div className="px-5">
        <div className="inline-flex rounded-lg bg-surface-2 p-1">
          {(["weekly", "all"] as const).map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={range === r}
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                range === r ? "bg-surface-3 text-accent" : "text-mid hover:text-hi"
              }`}
            >
              {r === "weekly" ? "Weekly" : "All-time"}
            </button>
          ))}
        </div>

      <ul className="mt-6 divide-y divide-[var(--border-soft)] rounded-2xl border border-edge bg-surface">
        {leaders.map((l) => (
          <li
            key={l.handle}
            className={`flex items-center gap-3 px-4 py-3 ${l.me ? "bg-surface-2" : ""}`}
          >
            <span className="w-8 text-center font-mono text-sm font-semibold text-mid">
              {l.rank <= 3 ? MEDALS[l.rank - 1] : l.rank}
            </span>
            <Avatar initials={l.initials} hue={l.hue} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-hi">
                {l.name}
                {l.me ? <span className="ml-2 text-xs text-accent">You</span> : null}
              </p>
              <p className="truncate text-xs text-dim">{l.handle}</p>
            </div>
            <span
              className={`font-mono text-sm font-semibold tabular-nums ${
                l.returnPct >= 0 ? "text-accent" : "text-danger"
              }`}
            >
              {formatPercent(l.returnPct)}
            </span>
            {l.me ? null : (
              <button
                type="button"
                onClick={() =>
                  toast.success(`Copying ${l.name}`, {
                    description: "Mirroring future trades with $10,000 virtual.",
                  })
                }
                className="rounded-lg border border-edge px-3 py-1.5 text-xs font-semibold text-hi transition-colors hover:border-accent hover:text-accent"
              >
                Copy
              </button>
            )}
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
