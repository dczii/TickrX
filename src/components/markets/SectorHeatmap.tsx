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
      className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4"
    >
      {sectors.map((sector) => {
        const up = sector.changePct >= 0;
        return (
          <div
            key={sector.name}
            role="gridcell"
            data-change={sector.changePct}
            // Continuous gradient fill — see heatmapColor().
            style={{ backgroundColor: heatmapColor(sector.changePct) }}
            className="flex h-16 flex-col justify-between rounded-lg p-3"
          >
            <span className="text-xs font-semibold leading-tight text-hi">{sector.name}</span>
            <span
              className={`font-mono text-sm font-semibold tabular-nums ${
                up ? "text-accent" : "text-danger"
              }`}
            >
              {formatPercent(sector.changePct)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
