import type { ReactNode } from "react";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

interface PageShellProps {
  children: ReactNode;
  email?: string | null;
  avatarUrl?: string | null;
}

export default function PageShell({ children, email, avatarUrl }: PageShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-slate-100">
      <Sidebar email={email} avatarUrl={avatarUrl} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
