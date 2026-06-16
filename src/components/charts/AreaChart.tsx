import { walk, toPolyline } from "@/lib/charts";

interface AreaChartProps {
  seed?: number;
  positive?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

/** Seeded performance area chart (mirrors the prototype's <AreaChart>). */
export default function AreaChart({
  seed = 11,
  positive = true,
  width = 720,
  height = 160,
  className,
}: AreaChartProps) {
  const values = walk(seed, 40, 0.12, positive);
  const line = toPolyline(values, width, height, 6);
  const color = positive ? "var(--accent)" : "var(--danger)";
  const gradientId = `area-grad-${seed}-${positive ? "u" : "d"}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`block w-full ${className ?? ""}`}
      style={{ height }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${line} ${width},${height}`} fill={`url(#${gradientId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
