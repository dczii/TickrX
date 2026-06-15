import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import Sidebar from "@/components/layout/Sidebar";
import { signOut } from "@/lib/auth";
import { NAV_ITEMS } from "@/lib/nav";

jest.mock("next/navigation", () => ({
  usePathname: () => "/markets",
}));

jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <img alt={props.alt ?? ""} src={props.src} />,
}));

jest.mock("@/lib/auth", () => ({
  signOut: jest.fn(),
}));

describe("Sidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders every nav link", () => {
    render(<Sidebar email="trader@example.com" />);
    for (const item of NAV_ITEMS) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", item.href);
    }
  });

  it("marks the current route as active", () => {
    render(<Sidebar email="trader@example.com" />);
    const markets = screen.getByRole("link", { name: "Markets" });
    expect(markets).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("shows the user email", () => {
    render(<Sidebar email="trader@example.com" />);
    expect(screen.getByText("trader@example.com")).toBeInTheDocument();
  });

  it("signs out when the sign-out button is clicked", async () => {
    (signOut as jest.Mock).mockResolvedValue(undefined);
    render(<Sidebar email="trader@example.com" />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    await waitFor(() => expect(signOut).toHaveBeenCalled());
  });
});
