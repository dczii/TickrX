"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface ScreenHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Show a back chevron that navigates to the previous screen instead of a plain title. */
  back?: boolean;
  /** Right-aligned actions (bell, avatar, search, etc.). */
  right?: ReactNode;
}

/**
 * Shared header for app screens. Root tabs (Home/Markets/Portfolio/Profile)
 * use `back={false}` with a greeting/title + actions; sub-screens
 * (stock detail, trades, leaderboard, settings, watchlist) use `back` for a
 * chevron + centered title, mirroring the prototype's detail-view header.
 */
export default function ScreenHeader({ title, subtitle, back, right }: ScreenHeaderProps) {
  const router = useRouter();

  if (back) {
    return (
      <header className="flex h-12 shrink-0 items-center gap-2 px-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-hi transition-colors hover:bg-surface-2"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="flex-1 truncate text-center text-[15px] font-semibold text-hi">{title}</h1>
        <div className="flex h-9 w-9 items-center justify-center">{right}</div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-5 pb-2 pt-1">
      <div>
        {subtitle ? <p className="text-sm text-dim">{subtitle}</p> : null}
        <h1 className="text-xl font-bold tracking-tight text-hi">{title}</h1>
      </div>
      {right ? <div className="flex items-center gap-4">{right}</div> : null}
    </header>
  );
}
