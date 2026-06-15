import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { formatPercent } from "@/lib/markets";

interface ChangeChipProps {
  value: number;
  showIcon?: boolean;
}

export default function ChangeChip({ value, showIcon = true }: ChangeChipProps) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      role="status"
      aria-label={`${positive ? "Up" : "Down"} ${Math.abs(value).toFixed(2)} percent`}
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs tabular-nums ${
        positive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
      }`}
    >
      {showIcon ? <Icon size={12} aria-hidden="true" /> : null}
      {formatPercent(value)}
    </span>
  );
}
