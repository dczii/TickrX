import { NextRequest } from "next/server";
import { google } from "googleapis";
import { z } from "zod";

const BodySchema = z.object({
  email: z.string().email(),
  source: z.string().optional(), // e.g. "hero" or "footer"
  // simple honeypot
  website: z.string().optional(),
});

function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!;
  // next/env can escape newlines; normalize
  privateKey = privateKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // bot trap
    if (parsed.data.website && parsed.data.website.trim().length > 0) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sheets = getSheetsClient();
    const SHEET_ID = process.env.SHEET_ID!;
    const now = new Date().toISOString();
    const ua = req.headers.get("user-agent") || "";
    const { email, source } = parsed.data;

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "A:D", // timestamp, email, ua, source
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[now, email, ua, source ?? ""]],
      },
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to subscribe" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
