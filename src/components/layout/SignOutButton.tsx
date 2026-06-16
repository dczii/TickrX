"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { signOut } from "@/lib/auth";

export default function SignOutButton() {
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
      window.location.href = "/login";
    } catch {
      toast.error("Could not sign out. Try again.");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={busy}
      className="flex w-full items-center gap-3 rounded-xl border border-edge bg-surface px-4 py-3 text-sm font-semibold text-danger transition-colors hover:bg-surface-2 disabled:opacity-60"
    >
      <LogOut size={18} aria-hidden="true" />
      Sign out
    </button>
  );
}
