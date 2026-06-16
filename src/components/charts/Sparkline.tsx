import { walk, toPolyline } from "@/lib/charts";

interface SparklineProps {
  seed: number;
  positive?: boolean;
  width?: number;
  height?: number;
  fill?: boolean;
}

/** Tiny seeded sparkline (mirrors the prototype's <Sparkline>). */
export default function Sparkline({
  seed,
  positive = true,
  width = 92,
  height = 28,
  fill = false,
}: SparklineProps) {
  const values = walk(seed, 24, 0.22, positive);
  const points = toPolyline(values, width, height, 2);
  const color = positive ? "var(--accent)" : "var(--danger)";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block"
      aria-hidden="true"
    >
      {fill ? (
        <polygon points={`0,${height} ${points} ${width},${height}`} fill={color} opacity="0.1" />
      ) : null}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
