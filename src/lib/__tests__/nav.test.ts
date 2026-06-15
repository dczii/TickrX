import { NAV_ITEMS } from "@/lib/nav";

describe("NAV_ITEMS", () => {
  it("exposes the five primary destinations in order", () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      "Home",
      "Markets",
      "Portfolio",
      "Profile",
      "Settings",
    ]);
  });

  it("points each link at its route with an icon", () => {
    expect(NAV_ITEMS.map((item) => item.href)).toEqual([
      "/dashboard",
      "/markets",
      "/portfolio",
      "/profile",
      "/settings",
    ]);
    for (const item of NAV_ITEMS) {
      expect(item.icon).toBeDefined();
    }
  });
});
