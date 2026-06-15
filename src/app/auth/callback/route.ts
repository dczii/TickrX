import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { ensurePortfolio } from "@/lib/portfolio";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectedFrom = searchParams.get("redirectedFrom");
  const next = redirectedFrom?.startsWith("/") ? redirectedFrom : "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  try {
    await ensurePortfolio(supabase, data.user.id);
  } catch {
    // Portfolio provisioning is non-blocking — the signup trigger is the
    // primary path; surface auth success even if the fallback insert races.
  }

  return NextResponse.redirect(`${origin}${next}`);
}
