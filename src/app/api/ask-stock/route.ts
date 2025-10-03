import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { stock, question } = await req.json();

    if (!stock || !question) {
      return new Response(JSON.stringify({ error: "Stock and question are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `
      You are an expert stock analyst with deep knowledge of equity research, financial statements, valuation metrics, market trends, and company fundamentals.

      Always assume the user’s question is about the specified stock: ${stock}.
      Interpret ambiguous or general questions (e.g., "What’s the outlook?" or "Is it a good buy?") as referring to ${stock}.

      If the question is clearly unrelated to ${stock}, politely respond:
      "I can only answer questions based on ${stock}."

      When answering:
      - Be clear, factual, and concise.
      - Provide context using fundamentals (P/E, EPS, revenue, growth, margins, guidance, etc.) if relevant.
      - Where useful, include both bullish and bearish considerations.
      - Avoid speculation outside of publicly available or widely accepted financial knowledge.
      - Never provide advice outside of ${stock}.

      Tone: Professional, data-driven, and insightful — like a seasoned Wall Street equity research analyst.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    });

    const answer = completion.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
