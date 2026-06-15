import { render, screen } from "@testing-library/react";

import PageShell from "@/components/layout/PageShell";

jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <img alt={props.alt ?? ""} src={props.src} />,
}));

jest.mock("@/lib/auth", () => ({ signOut: jest.fn() }));

jest.mock("@/components/layout/TopBar", () => ({
  __esModule: true,
  default: () => <div data-testid="top-bar" />,
}));

describe("PageShell", () => {
  it("renders the sidebar, top bar, and main content slot", () => {
    render(
      <PageShell email="trader@example.com">
        <p>Dashboard content</p>
      </PageShell>
    );

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByTestId("top-bar")).toBeInTheDocument();

    const main = screen.getByRole("main");
    expect(main).toHaveTextContent("Dashboard content");
  });
});
