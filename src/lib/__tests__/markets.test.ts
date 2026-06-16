import {
  heatmapColor,
  sortRows,
  topMovers,
  formatPrice,
  formatCompact,
  formatPercent,
  formatUsd,
  mapSnapshot,
  mockMarketRows,
  mockSectors,
  GICS_SECTORS,
} from "@/lib/markets";
import type { MarketRow } from "@/types/markets";

const row = (symbol: string, changePct: number, price = 100): MarketRow => ({
  symbol,
  name: symbol,
  price,
  changePct,
  volume: 1000,
  marketCap: 1e9,
  high52: 0,
  low52: 0,
});

describe("heatmapColor", () => {
  it("returns mint green for gains, soft red for losses", () => {
    expect(heatmapColor(3)).toMatch(/^rgba\(43, 214, 138,/);
    expect(heatmapColor(0)).toMatch(/^rgba\(43, 214, 138,/);
    expect(heatmapColor(-1)).toMatch(/^rgba\(255, 92, 114,/);
  });

  it("scales alpha by magnitude, capped at ±2.2%", () => {
    expect(heatmapColor(3)).toBe("rgba(43, 214, 138, 0.52)");
    expect(heatmapColor(2.2)).toBe("rgba(43, 214, 138, 0.52)");
    expect(heatmapColor(0)).toBe("rgba(43, 214, 138, 0.1)");
    expect(heatmapColor(-2.2)).toBe("rgba(255, 92, 114, 0.52)");
  });
});

describe("sortRows", () => {
  const rows = [row("AAA", 1), row("BBB", -2), row("CCC", 3)];

  it("sorts numerically ascending and descending without mutating input", () => {
    const asc = sortRows(rows, "changePct", "asc");
    expect(asc.map((r) => r.symbol)).toEqual(["BBB", "AAA", "CCC"]);
    expect(sortRows(rows, "changePct", "desc").map((r) => r.symbol)).toEqual(["CCC", "AAA", "BBB"]);
    expect(rows[0].symbol).toBe("AAA");
  });

  it("sorts strings alphabetically", () => {
    expect(sortRows(rows, "symbol", "asc").map((r) => r.symbol)).toEqual(["AAA", "BBB", "CCC"]);
  });
});

describe("topMovers", () => {
  const rows = [row("A", 5), row("B", -3), row("C", 1), row("D", -8)];

  it("returns the biggest gainers and losers", () => {
    expect(topMovers(rows, "gainers", 2).map((r) => r.symbol)).toEqual(["A", "C"]);
    expect(topMovers(rows, "losers", 2).map((r) => r.symbol)).toEqual(["D", "B"]);
  });
});

describe("formatters", () => {
  it("formats prices with two decimals", () => {
    expect(formatPrice(1234.5)).toBe("1,234.50");
  });

  it("compacts large numbers", () => {
    expect(formatCompact(2.5e12)).toBe("2.50T");
    expect(formatCompact(3.2e9)).toBe("3.20B");
    expect(formatCompact(4.1e6)).toBe("4.10M");
    expect(formatCompact(5.5e3)).toBe("5.50K");
    expect(formatCompact(900)).toBe("900");
  });

  it("formats signed percentages", () => {
    expect(formatPercent(2.4)).toBe("+2.40%");
    expect(formatPercent(-1.1)).toBe("-1.10%");
  });

  it("formats USD with a dollar sign and grouping", () => {
    expect(formatUsd(1234.5)).toBe("$1,234.50");
    expect(formatUsd(0)).toBe("$0.00");
  });
});

describe("mapSnapshot", () => {
  it("normalizes a Polygon snapshot payload", () => {
    const rows = mapSnapshot([
      { ticker: "AAPL", todaysChangePerc: 1.5, day: { c: 230, v: 1000 }, min: { c: 231 } },
      { ticker: "MSFT" },
    ]);
    expect(rows[0]).toMatchObject({ symbol: "AAPL", price: 231, changePct: 1.5, volume: 1000 });
    expect(rows[1]).toMatchObject({ symbol: "MSFT", price: 0, changePct: 0, volume: 0 });
  });
});

describe("mock data", () => {
  it("produces deterministic rows and all GICS sectors", () => {
    expect(mockMarketRows()).toEqual(mockMarketRows());
    expect(mockMarketRows().length).toBeGreaterThanOrEqual(10);
    expect(mockSectors().map((s) => s.name)).toEqual([...GICS_SECTORS]);
  });
});
