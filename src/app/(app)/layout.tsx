import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import PageShell from "@/components/layout/PageShell";
import { createClient } from "@/lib/supabase/server";
import { ensurePortfolio } from "@/lib/portfolio";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    await ensurePortfolio(supabase, user.id);
  } catch {
    // Non-blocking: the signup trigger is the primary provisioning path.
  }

  const avatarUrl = (user.user_metadata?.avatar_url as string | undefined) ?? null;

  return (
    <PageShell email={user.email} avatarUrl={avatarUrl}>
      {children}
    </PageShell>
  );
}
