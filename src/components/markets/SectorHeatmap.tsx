import type { Sector } from "@/types/markets";
import { heatmapColor, formatPercent } from "@/lib/markets";

interface SectorHeatmapProps {
  sectors: Sector[];
}

export default function SectorHeatmap({ sectors }: SectorHeatmapProps) {
  return (
    <div
      role="grid"
      aria-label="Sector performance heatmap"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
    >
      {sectors.map((sector) => (
        <div
          key={sector.name}
          role="gridcell"
          data-change={sector.changePct}
          className={`flex flex-col justify-between rounded-lg p-3 text-white ${heatmapColor(
            sector.changePct
          )}`}
        >
          <span className="text-xs font-medium leading-tight">{sector.name}</span>
          <span className="mt-2 font-mono text-sm tabular-nums">
            {formatPercent(sector.changePct)}
          </span>
        </div>
      ))}
    </div>
  );
}
