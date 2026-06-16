import { render, screen } from "@testing-library/react";

import StatCard from "@/components/ui/StatCard";
import Avatar from "@/components/ui/Avatar";

describe("StatCard", () => {
  it("renders label, value, and a toned sub-line", () => {
    render(<StatCard label="Day P&L" value="+$100.00" sub="+1.74%" tone="up" />);
    expect(screen.getByText("Day P&L")).toBeInTheDocument();
    expect(screen.getByText("+$100.00")).toBeInTheDocument();
    expect(screen.getByText("+1.74%")).toHaveClass("text-accent");
  });

  it("omits the sub-line when not provided", () => {
    render(<StatCard label="Cash" value="$1.00" />);
    expect(screen.queryByText("+1.74%")).not.toBeInTheDocument();
  });
});

describe("Avatar", () => {
  it("renders initials", () => {
    render(<Avatar initials="AT" hue={158} />);
    expect(screen.getByText("AT")).toBeInTheDocument();
  });
});
