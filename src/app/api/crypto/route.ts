// pages/api/crypto10.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type {
  Crypto10ApiResponse,
  CryptoBySymbolApiResponseError,
  CGCoin,
  Pick,
} from "@/types/crypto";

const CG_ENDPOINT =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=200&page=1&sparkline=false&price_change_percentage=1h,24h,7d";

/**
 * Calculates a score for a cryptocurrency coin based on its market data.
 *
 * The scoring logic is as follows:
 * - Rejects coins with total volume less than $50M, market cap less than $500M,
 *   or 24h price change (absolute value) greater than 6.5% by returning -1.
 * - Otherwise, computes a score based on:
 *   - Proximity to a 24h price change target of 2.5% (closer is better, up to a max of 5 points).
 *   - Positive 1h price momentum (h1 + 1, minimum 0, weighted by 1.5).
 *   - Volume boost, calculated as log10(volume) - 6, rewarding higher volume.
 * - The final score is: (proximity * 2) + (momentum * 1.5) + volBoost.
 *
 * @param c - The coin data object (CGCoin) containing market and price change information.
 * @returns The computed score for the coin, or -1 if it fails the initial filters.
 */
function scoreCoin(c: CGCoin) {
  const vol = c.total_volume || 0;
  const mc = c.market_cap || 0;
  const h1 = c.price_change_percentage_1h_in_currency ?? 0;
  const h24 = c.price_change_percentage_24h_in_currency ?? 0;

  if (vol < 50_000_000) return -1;
  if (mc < 500_000_000) return -1;
  if (Math.abs(h24) > 6.5) return -1;

  const target24 = 2.5;
  const proximity = Math.max(0, 5 - Math.abs(h24 - target24));
  const momentum = Math.max(0, h1 + 1);
  const volBoost = Math.log10(Math.max(1, vol)) - 6;

  return proximity * 2 + momentum * 1.5 + volBoost;
}

function toCompact(c: CGCoin) {
  return {
    id: c.id,
    symbol: c.symbol.toUpperCase(),
    name: c.name,
    price: c.current_price,
    volume24h: c.total_volume,
    mcap: c.market_cap,
    change24h: c.price_change_percentage_24h_in_currency ?? 0,
    pct_1h: c.price_change_percentage_1h_in_currency ?? 0,
    pct_24h: c.price_change_percentage_24h_in_currency ?? 0,
    pct_7d: c.price_change_percentage_7d_in_currency ?? 0,
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<Crypto10ApiResponse | CryptoBySymbolApiResponseError>
) {
  // Accept only GET (Pages Router style)
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 1) Fetch live CoinGecko snapshot (no caching)
    const cgRes = await fetch(CG_ENDPOINT, {
      headers: { "x-cg-demo-api-key": process.env.NEXT_PUBLIC_CG_API_KEY || "" },
      cache: "no-store",
    });

    if (!cgRes.ok) {
      const text = await cgRes.text();
      return res.status(502).json({ error: "CoinGecko request failed", detail: text });
    }

    const raw: CGCoin[] = await cgRes.json();

    // 2) Rank & slice candidates
    const ranked = raw
      .map((c) => ({ coin: c, score: scoreCoin(c) }))
      .filter((x) => x.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 25);

    const candidates = ranked.map((r) => toCompact(r.coin));

    if (candidates.length === 0) {
      return res.status(200).json({
        timestamp: new Date().toISOString(),
        source: "coingecko",
        candidates: [],
        picks: [],
        note: "No suitable candidates found under current heuristic. Try relaxing filters.",
      });
    }

    // 3) Ask ChatGPT to pick best 10 (JSON)

    const system = "You are an expert crypto day trader. Be concise, pragmatic, and risk-aware.";
    const user = `
Check the following CoinGecko snapshot (already provided). 
Pick the **10 cryptocurrencies** most likely to move **up to ~5%** within a short day-trading window.
Prioritize: healthy liquidity (volume), steady 1h momentum, moderate 24h move (room to reach ~5%), and avoid obvious pump/dump patterns.

Return strictly this JSON:
{
  "picks": [
    {
      "name": "",
      "symbol": "",
      "price": 0,
      "pct_1h": 0,
      "change24h": 0,
      "pct_24h": 0,
      "volume24h": 0,
      "why": "1-2 sentences explaining the edge"
    }
  ]
}

Candidates:
${JSON.stringify(candidates, null, 2)}
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

    // 4) Respond (Pages Router uses res.status().json())
    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        source: "coingecko",
        candidates,
        picks: (aiJson.picks as Pick[] | undefined)?.slice(0, 10) ?? [],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e: any) {
    return res.status(500).json({ error: "Unexpected error", detail: e?.message || String(e) });
  }
}
