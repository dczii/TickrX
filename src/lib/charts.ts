/**
 * Pure geometry helpers for the lightweight SVG charts that mirror the
 * prototype's seeded-RNG sparkline / area charts (see TickrX_Prototype.html).
 * Kept framework-free so they can be unit-tested directly.
 */

/** Deterministic LCG — same series for a given seed across renders. */
export function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/** Normalized (0..1) walk biased toward `up` at the tail. */
export function walk(seed: number, n: number, volatility: number, up: boolean): number[] {
  const r = rng(seed);
  const pts: number[] = [];
  let v = 0.5;
  for (let i = 0; i < n; i++) {
    v += (r() - 0.5) * volatility;
    v = Math.max(0.08, Math.min(0.92, v));
    pts.push(v);
  }
  pts[n - 1] = up ? Math.max(pts[0] + 0.12, pts[n - 1]) : Math.min(pts[0] - 0.12, pts[n - 1]);
  return pts;
}

/** Maps a normalized walk into "x,y" SVG polyline points within a box. */
export function toPolyline(values: number[], width: number, height: number, pad = 2): string {
  const n = values.length;
  return values
    .map((p, i) => `${(i / (n - 1)) * width},${height - p * (height - pad * 2) - pad}`)
    .join(" ");
}
