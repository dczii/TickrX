import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import PhoneShell from "@/components/layout/PhoneShell";
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

  return <PhoneShell>{children}</PhoneShell>;
}
