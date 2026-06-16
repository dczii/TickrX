"use client";

import { useEffect, useState } from "react";

function currentTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** iOS-style status bar (time + signal/wifi/battery glyphs) shown atop the phone frame. */
export default function StatusBar() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(currentTime());
    const id = setInterval(() => setTime(currentTime()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden h-11 shrink-0 items-end justify-between px-6 pb-2 font-mono text-[15px] font-semibold text-hi sm:flex">
      <span className="tracking-wide" aria-hidden="true">
        {time ?? ""}
      </span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <svg width="18" height="12" viewBox="0 0 18 12">
          <g fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="1" />
            <rect x="5" y="5" width="3" height="7" rx="1" />
            <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
            <rect x="15" y="0" width="3" height="12" rx="1" />
          </g>
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M1.5 4.2a10 10 0 0 1 14 0" />
            <path d="M4.2 7a6 6 0 0 1 8.6 0" />
          </g>
          <circle cx="8.5" cy="10" r="1.2" fill="currentColor" />
        </svg>
        <svg width="26" height="13" viewBox="0 0 26 13">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="12"
            rx="3.5"
            fill="none"
            stroke="currentColor"
            opacity="0.4"
          />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
          <rect x="24" y="4" width="1.5" height="5" rx="1" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
