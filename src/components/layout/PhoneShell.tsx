import type { ReactNode } from "react";
import { Toaster } from "sonner";

import StatusBar from "@/components/layout/StatusBar";
import TabBar from "@/components/layout/TabBar";

interface PhoneShellProps {
  children: ReactNode;
}

/**
 * Centers the app in a literal phone-device frame (bezel, notch, status bar,
 * bottom tab bar, home-indicator) above the `sm` breakpoint, matching
 * TickrX_Prototype.html. Below `sm` (a real mobile browser) the bezel is
 * dropped and the screen fills the viewport edge-to-edge, since a real
 * device already supplies its own chrome.
 *
 * `phone-screen` gets `transform-gpu` so it becomes a CSS containing block —
 * any `position: fixed` descendant (the Sonner Toaster, full-screen search
 * sheet) is then visually confined to the frame instead of the browser
 * viewport.
 */
export default function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050607] sm:p-6">
      <div className="h-screen w-full sm:h-[844px] sm:w-[390px] sm:rounded-[46px] sm:bg-[linear-gradient(150deg,#26292f,#121316)] sm:p-[10px] sm:shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_0_2px_#0c0d10]">
        <div className="phone-screen relative flex h-full w-full transform-gpu flex-col overflow-hidden bg-[var(--bg)] sm:rounded-[38px]">
          <div
            className="absolute left-1/2 top-2.5 z-[60] hidden h-[30px] w-[120px] -translate-x-1/2 rounded-full bg-black sm:block"
            aria-hidden="true"
          />
          <StatusBar />
          <main className="flex-1 overflow-y-auto" role="main">
            {children}
          </main>
          <TabBar />
          <Toaster position="top-center" richColors theme="dark" />
        </div>
      </div>
    </div>
  );
}
