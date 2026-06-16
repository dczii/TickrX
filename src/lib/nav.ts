import { Home, LineChart, Briefcase, User, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** The 4 bottom-tab destinations, matching the prototype's TabBar. */
export const TAB_ITEMS: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Markets", href: "/markets", icon: LineChart },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
  { label: "Profile", href: "/profile", icon: User },
];

/** Secondary destinations reached from the Profile screen, not the tab bar. */
export const PROFILE_LINKS: Omit<NavItem, "icon">[] = [
  { label: "Watchlist", href: "/watchlist" },
  { label: "Trade History", href: "/trades" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Settings", href: "/settings" },
];
