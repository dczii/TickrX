import { quoteFor, DEMO_HOLDINGS } from "@/lib/demoData";

describe("quoteFor", () => {
  it("returns a known quote from the fixtures", () => {
    const q = quoteFor("nvda");
    expect(q.symbol).toBe("NVDA");
    expect(q.name).toBe("NVIDIA Corp");
    expect(q.price).toBeGreaterThan(0);
  });

  it("falls back to a neutral quote for unknown symbols", () => {
    const q = quoteFor("zzzz");
    expect(q).toEqual({ symbol: "ZZZZ", name: "ZZZZ", price: 100, changePct: 0 });
  });

  it("covers every holding symbol", () => {
    for (const h of DEMO_HOLDINGS) {
      expect(quoteFor(h.symbol).price).toBe(h.price);
    }
  });
});
