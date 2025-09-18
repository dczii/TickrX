import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { StocksApiResponse, StockPick, Body } from "@/types/stocks";

export const runtime = "edge"; // optional: faster cold starts

const SYSTEM_PROMPT = `You are an expert US stock day trader with advanced TradingView knowledge. 
Return ONLY valid JSON, no prose. 
Use concise, data-driven reasoning referencing RSI, MACD, MA crossovers, support/resistance, 
volume spikes, and near-term catalysts. Only include liquid tickers with realistic momentum 
for ~target_gain_pct% short-term move.`;

const JSON_INSTRUCTIONS = `
Return an object:
{
  "picks": [
    {
      "name": "Company Name",
      "symbol": "TICKER",
      "current_price": number,
      "change_24h": number,
      "volume_24h": number,
      "reasoning": "why a ~TARGET% move is plausible (1-2 sentences)",
      "suggestion": "BUY" | "SELL" | "HOLD"
    }
  ],
  "notes": "optional brief portfolio-level note"
}
Ensure "picks" length equals LIMIT and fields are populated. Use numbers where possible.
`;

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function GET(_req: NextRequest) {
  try {
    // defaults (from original POST body)
    const limit = 10;
    const target_gain_pct = 5;
    const indicators = ["RSI", "MACD", "MA20/50", "Volume", "Support/Resistance"];
    const risk = "medium";
    const universe = "US";

    if (!client.apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userPrompt = [
      `Universe: ${universe}. Risk: ${risk}.`,
      `Indicators to consider: ${indicators.join(", ")}.`,
      `Target short-term gain: ~${target_gain_pct}%.`,
      `LIMIT: ${limit}.`,
      JSON_INSTRUCTIONS,
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT.replace("target_gain_pct", target_gain_pct.toString()),
        },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    let parsed: { picks?: StockPick[]; notes?: string };

    try {
      parsed = JSON.parse(raw);
    } catch {
      return new Response(
        JSON.stringify({ error: "Model did not return valid JSON.", model_output: raw }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const picks = Array.isArray(parsed.picks) ? parsed.picks : [];
    if (picks.length !== limit) {
      parsed.picks = picks.slice(0, limit);
    }

    return new Response(
      JSON.stringify({
        generated_at: new Date().toISOString(),
        target_gain_pct,
        risk,
        universe,
        picks: parsed.picks,
        notes: parsed.notes ?? null,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? "Unexpected error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
