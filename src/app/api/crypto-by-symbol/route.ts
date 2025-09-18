import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { symbols } = await req.json();

    if (!symbols || symbols.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Invalid request",
          detail: 'Provide body like: { "symbols": ["BCH","MNT"] }',
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const parsedSymbols = JSON.parse(symbols);

    // Build /simple/price URL using symbols (NOT ids)
    const params = new URLSearchParams({
      vs_currencies: "usd",
      symbols: parsedSymbols.join(","),
      include_tokens: "top", // only top token per symbol
      include_market_cap: "true",
      include_24hr_vol: "true",
      include_24hr_change: "true",
      include_last_updated_at: "true",
    });

    const url = `https://api.coingecko.com/api/v3/simple/price?${params.toString()}`;
    const cgRes = await fetch(url, {
      headers: { "User-Agent": "crypto-symbol-nextjs" },
      cache: "no-store",
    });

    if (!cgRes.ok) {
      const text = await cgRes.text();
      return new Response(JSON.stringify({ error: "CoinGecko request failed", detail: text }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Response is an object keyed by coin id (when symbols used, top token chosen)
    // Example:
    // { "mantle": { "usd": 0.64, "usd_market_cap": ..., "usd_24h_vol": ..., "usd_24h_change": ..., "last_updated_at": 1711356300 }, ... }
    const raw = (await cgRes.json()) as Record<
      string,
      {
        usd?: number;
        usd_market_cap?: number;
        usd_24h_vol?: number;
        usd_24h_change?: number;
        last_updated_at?: number;
      }
    >;

    // Map back to requested symbols; we won’t have exact names from this endpoint
    const candidates = Object.entries(raw).map(([id, v]) => {
      // Try to find which requested symbol this entry maps to (best-effort)
      // When include_tokens=top, the symbol chosen is the primary/top token for that id.
      // We'll default to uppercasing the first matching requested symbol by heuristic.
      const requestedSymbol =
        parsedSymbols.find((s: string) => id.toLowerCase().includes(s.toLowerCase())) ?? symbols[0];

      return {
        id,
        symbol: (requestedSymbol || "").toUpperCase(),
        name: null, // simple/price doesn't provide names
        price: v.usd ?? null,
        mcap: v.usd_market_cap ?? null,
        volume24h: v.usd_24h_vol ?? null,
        pct_24h: v.usd_24h_change ?? null,
        last_updated_at: v.last_updated_at ?? null,
        pct_1h: null,
        pct_7d: null,
      };
    });

    if (candidates.length === 0) {
      return new Response(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          source: "coingecko",
          candidates: [],
          picks: [],
          note: "No results for provided symbols via simple/price. Try include_tokens=all or use /coins/markets.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Short reasoning via ChatGPT (optional)
    const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
    const system = "You are an expert crypto day trader. Be concise, pragmatic, and risk-aware.";
    const user = `
Explain in 1–2 sentences why each candidate might move up to ~5% in the short term (day-trade window).
Return strictly this JSON:
{
  "picks": [
    { "name": "", "symbol": "", "price": 0, "pct_1h": null, "pct_24h": 0, "volume24h": 0, "why": "1-2 sentences" }
  ]
}
Candidates:
${JSON.stringify(
  candidates.map((c) => ({
    name: c.name,
    symbol: c.symbol,
    price: c.price,
    pct_24h: c.pct_24h,
    volume24h: c.volume24h,
  })),
  null,
  2
)}
`;

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    let aiJson: any = {};
    try {
      aiJson = JSON.parse(chat.choices[0]?.message?.content || "{}");
    } catch {
      aiJson = { picks: [] };
    }

    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        source: "coingecko",
        candidates,
        picks: aiJson.picks ?? [],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e: any) {
    console.log("Error,", e.message);
    return new Response(
      JSON.stringify({ error: "Unexpected error", detail: e?.message || String(e) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
