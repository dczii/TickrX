import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PROFILE_LINKS } from "@/lib/nav";
import ScreenHeader from "@/components/layout/ScreenHeader";
import SignOutButton from "@/components/layout/SignOutButton";
import Avatar from "@/components/ui/Avatar";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = user?.email?.split("@")[0] ?? "Trader";

  return (
    <section>
      <ScreenHeader title="Profile" />

      <div className="px-5">
        <div className="flex items-center gap-3 rounded-xl border border-edge bg-surface p-4">
          <Avatar initials={name.slice(0, 2).toUpperCase()} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-hi">{user?.email ?? "—"}</p>
            <p className="truncate text-xs text-dim">{user?.id ?? "—"}</p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-[var(--border-soft)] rounded-xl border border-edge bg-surface">
          {PROFILE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-surface-2"
            >
              <span className="text-sm font-medium text-hi">{link.label}</span>
              <ChevronRight size={16} aria-hidden="true" className="text-dim" />
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </section>
  );
}
