"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { NAV_ITEMS } from "@/lib/nav";
import { signOut } from "@/lib/auth";

interface SidebarProps {
  email?: string | null;
  avatarUrl?: string | null;
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({ email, avatarUrl }: SidebarProps) {
  const pathname = usePathname();

  async function handleSignOut() {
    try {
      await signOut();
      window.location.href = "/login";
    } catch {
      toast.error("Could not sign out. Try again.");
    }
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-edge bg-bg lg:w-60">
      <div className="flex h-16 items-center px-5">
        <Link href="/dashboard" aria-label="TickrX home">
          <Image src="/logo-full.png" alt="TickrX" width={120} height={40} priority />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Primary">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-surface-3 text-accent" : "text-mid hover:bg-surface hover:text-hi"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-edge p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="" width={32} height={32} className="rounded-full" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
              {(email ?? "?").charAt(0).toUpperCase()}
            </div>
          )}
          <span className="flex-1 truncate text-xs text-mid">{email ?? "Signed in"}</span>
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sign out"
            className="text-dim transition-colors hover:text-danger"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
