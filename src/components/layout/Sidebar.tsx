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
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 lg:w-60">
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
                active
                  ? "bg-zinc-900 text-emerald-400"
                  : "text-slate-400 hover:bg-zinc-900 hover:text-slate-100"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="" width={32} height={32} className="rounded-full" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-400">
              {(email ?? "?").charAt(0).toUpperCase()}
            </div>
          )}
          <span className="flex-1 truncate text-xs text-slate-400">{email ?? "Signed in"}</span>
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sign out"
            className="text-slate-500 transition-colors hover:text-red-500"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
