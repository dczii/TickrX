import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import TabBar from "@/components/layout/TabBar";
import { TAB_ITEMS } from "@/lib/nav";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("TabBar", () => {
  it("renders all tab items", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard");
    render(<TabBar />);

    for (const item of TAB_ITEMS) {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
    }
  });

  it("marks the active tab via aria-current", () => {
    (usePathname as jest.Mock).mockReturnValue("/markets");
    render(<TabBar />);

    expect(screen.getByRole("link", { name: "Markets" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("treats nested routes as active", () => {
    (usePathname as jest.Mock).mockReturnValue("/portfolio/123");
    render(<TabBar />);

    expect(screen.getByRole("link", { name: "Portfolio" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });
});
