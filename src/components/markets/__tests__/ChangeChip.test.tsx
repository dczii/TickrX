import { render, screen } from "@testing-library/react";

import ChangeChip from "@/components/markets/ChangeChip";

describe("ChangeChip", () => {
  it("renders a positive change in green with a + sign", () => {
    render(<ChangeChip value={2.4} />);
    const chip = screen.getByRole("status");
    expect(chip).toHaveTextContent("+2.40%");
    expect(chip.className).toContain("text-emerald-400");
  });

  it("renders a negative change in red", () => {
    render(<ChangeChip value={-1.1} />);
    const chip = screen.getByRole("status");
    expect(chip).toHaveTextContent("-1.10%");
    expect(chip.className).toContain("text-red-400");
  });
});
