import { rng, walk, toPolyline } from "@/lib/charts";

describe("rng", () => {
  it("is deterministic for a given seed", () => {
    const a = rng(7);
    const b = rng(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("returns values in [0, 1)", () => {
    const r = rng(42);
    for (let i = 0; i < 50; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("walk", () => {
  it("produces n bounded points", () => {
    const pts = walk(3, 24, 0.22, true);
    expect(pts).toHaveLength(24);
    for (const p of pts) {
      expect(p).toBeGreaterThanOrEqual(0.08);
      expect(p).toBeLessThanOrEqual(0.92);
    }
  });

  it("biases the tail upward when up and downward when down", () => {
    const up = walk(5, 24, 0.22, true);
    const down = walk(5, 24, 0.22, false);
    expect(up[up.length - 1]).toBeGreaterThanOrEqual(up[0] + 0.12);
    expect(down[down.length - 1]).toBeLessThanOrEqual(down[0] - 0.12);
  });
});

describe("toPolyline", () => {
  it("maps each value to an x,y pair spanning the width", () => {
    const points = toPolyline([0.5, 0.5, 0.5], 100, 20, 2);
    const pairs = points.split(" ");
    expect(pairs).toHaveLength(3);
    expect(pairs[0].startsWith("0,")).toBe(true);
    expect(pairs[2].startsWith("100,")).toBe(true);
  });
});
