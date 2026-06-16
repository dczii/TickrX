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
      className={`inline-flex items-center gap-1 rounded-[5px] px-[7px] py-[3px] font-mono text-[11.5px] font-semibold tabular-nums tracking-tight ${
        positive ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"
      }`}
    >
      {showIcon ? <Icon size={12} aria-hidden="true" /> : null}
      {formatPercent(value)}
    </span>
  );
}
