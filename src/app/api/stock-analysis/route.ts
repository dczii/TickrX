// app/api/stock-analysis/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type StockAnalysisRequest = { ticker?: string; companyName?: string } | undefined;

export type EarningsItem = {
  period: string; // e.g., "Q2 FY2025" or "2025-06"
  revenue?: { actual?: string; consensus?: string; beatOrMiss?: "beat" | "miss" | "inline" };
  eps?: { actual?: string; consensus?: string; beatOrMiss?: "beat" | "miss" | "inline" };
  marginsCommentary?: string;
  keyDrivers?: string[];
  notableOneOffs?: string[];
  fxImpact?: string;
  managementTone?: string; // short paraphrase
  stockReaction?: string; // e.g., "+4% AH" or "—"
};

export type AnalystJSON = {
  companyId: string; // "Apple Inc. (AAPL)" or "AAPL"
  companySnapshot: string;
  bullCase: string[];
  bearCase: string[];
  warningSigns: string[];
  earningsLast5: EarningsItem[]; // up to 5
  guidanceOutlook: {
    latestGuidance?: string;
    changes?: "raised" | "lowered" | "reaffirmed" | "mixed" | "unknown";
    vsConsensus?: string; // above / below / inline / unknown
    nearTermView?: string; // next quarter
    midTermView?: string; // 12–24 months
  };
  finalAssessment: {
    summary: string;
    shortTerm?: string; // 1–3 months
    mediumTerm?: string; // 6–12 months
    longTerm?: string; // 3+ years
    actionables?: string[]; // 3–5 bullets
    wouldChangeView?: string[]; // upside/downside catalysts that change thesis
  };
};

function buildPrompt(ticker: string, companyName?: string) {
  const id = companyName ? `${companyName} (${ticker.toUpperCase()})` : ticker.toUpperCase();

  return `You are a seasoned Wall Street equity analyst. Analyze ${id} in detail. Structure the output with clear section headers:

1) Company Snapshot
- Business overview, segment mix, geo exposure, competitive position.
- Key products/services, notable strategy shifts, M&A, cap allocation.

2) Bull Case (Upside Drivers)
- Specific catalysts, product/market tailwinds, TAM expansion.
- Financial strengths: growth, margins, FCF, balance sheet, operating leverage.
- Why multiple could re-rate; comparable peer context.

3) Bear Case (Downside Risks)
- Execution risks, competitive threats, regulatory/macro headwinds.
- Financial vulnerabilities: debt, dilution, margin compression, churn.

4) Warning Signs to Watch
- KPI deterioration, cohort trends, inventory/DSO, guidance “sandbagging”.
- Insider selling, unusual accounting, litigation, governance flags.

5) Earnings Review (Last 5 Reports)
For each of the last five quarters:
- Revenue & EPS vs. consensus (beat/miss), margin commentary.
- Notable drivers (pricing, volume, mix), one-offs, FX.
- Management tone and key quotes (paraphrase).
- Stock reaction post-print (if notable).

6) Guidance & Outlook
- Most recent guidance and any changes (raised / lowered / reaffirmed).
- Alignment vs. consensus; implied growth/margins; FY and next FY color.
- Near-term (next quarter) and 12–24 month view; key milestones.

7) Final Assessment
- Balanced conclusion integrating bull/bear probabilities.
- Short-term (1–3 months), medium-term (6–12 months), long-term (3+ years).
- What would change your view (upside/downside catalysts).
- Present actionable takeaways in 3–5 bullets.

Use professional tone. Be specific. If data is unavailable, state it briefly and proceed.`;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getParams(req: NextRequest): { ticker?: string; companyName?: string } {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker") ?? undefined;
  const companyName = searchParams.get("companyName") ?? undefined;
  return { ticker, companyName };
}

async function callOpenAIAsJSON(systemPrompt: string) {
  // Uses Chat Completions with JSON mode for broad compatibility.
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: "You are a precise Wall Street equity analyst. Output must be valid JSON.",
      },
      { role: "user", content: systemPrompt },
    ],
  });

  const content = resp.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(content) as AnalystJSON;
}

export async function POST(req: NextRequest) {
  let body: StockAnalysisRequest;
  try {
    body = await req.json();
  } catch {
    body = undefined;
  }

  const ticker = body?.ticker ?? getParams(req).ticker;
  const companyName = body?.companyName ?? getParams(req).companyName;

  if (!ticker || !/^[A-Za-z.\-]{1,10}$/.test(ticker)) {
    const res = {
      ok: false,
      error: "Invalid or missing 'ticker'.",
      detail: `POST JSON like { "ticker": "AAPL" } or include ?ticker=AAPL`,
    };
    return new Response(JSON.stringify(res), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prompt = buildPrompt(ticker, companyName);
  const analysis = await callOpenAIAsJSON(prompt);

  const res = {
    ok: true,
    ticker: ticker.toUpperCase(),
    companyName,
    analysis,
    promptUsed: prompt,
  };

  return new Response(JSON.stringify(res), {
    headers: { "Content-Type": "application/json" },
  });
}
