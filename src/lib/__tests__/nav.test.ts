import { TAB_ITEMS, PROFILE_LINKS } from "@/lib/nav";

describe("TAB_ITEMS", () => {
  it("exposes the 4 bottom-tab destinations in order", () => {
    expect(TAB_ITEMS.map((item) => item.label)).toEqual([
      "Home",
      "Markets",
      "Portfolio",
      "Profile",
    ]);
  });

  it("points each tab at its route with an icon", () => {
    expect(TAB_ITEMS.map((item) => item.href)).toEqual([
      "/dashboard",
      "/markets",
      "/portfolio",
      "/profile",
    ]);
    for (const item of TAB_ITEMS) {
      expect(item.icon).toBeDefined();
    }
  });
});

describe("PROFILE_LINKS", () => {
  it("exposes the secondary destinations reached from Profile", () => {
    expect(PROFILE_LINKS.map((item) => item.label)).toEqual([
      "Watchlist",
      "Trade History",
      "Leaderboard",
      "Settings",
    ]);
    expect(PROFILE_LINKS.map((item) => item.href)).toEqual([
      "/watchlist",
      "/trades",
      "/leaderboard",
      "/settings",
    ]);
  });
});
