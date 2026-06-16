"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { TAB_ITEMS } from "@/lib/nav";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Bottom tab bar (Home/Markets/Portfolio/Profile) + home-indicator, matching the prototype's TabBar. */
export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className="shrink-0 border-t border-edge bg-[rgba(15,17,20,0.92)] backdrop-blur-md">
      <nav aria-label="Primary" className="flex px-2 pt-2.5">
        {TAB_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 pb-1"
            >
              <Icon
                size={23}
                strokeWidth={active ? 1.9 : 1.6}
                className={active ? "text-accent" : "text-dim"}
                aria-hidden="true"
              />
              <span
                className={`text-[10.5px] tracking-wide ${
                  active ? "font-semibold text-accent" : "font-medium text-dim"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="flex justify-center py-2">
        <div className="h-[5px] w-[134px] rounded-full bg-white/30" />
      </div>
    </div>
  );
}
