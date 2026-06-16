import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import PhoneShell from "@/components/layout/PhoneShell";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

beforeEach(() => {
  (usePathname as jest.Mock).mockReturnValue("/dashboard");
});

describe("PhoneShell", () => {
  it("renders children inside the device frame's scrollable main area", () => {
    render(
      <PhoneShell>
        <p>Screen content</p>
      </PhoneShell>
    );

    expect(screen.getByText("Screen content")).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(screen.getByText("Screen content"));
  });

  it("renders the bottom tab bar", () => {
    render(
      <PhoneShell>
        <p>Screen content</p>
      </PhoneShell>
    );

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });
});
