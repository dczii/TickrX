import { act, render, screen } from "@testing-library/react";

import PriceTick from "@/components/markets/PriceTick";

describe("PriceTick", () => {
  it("renders the formatted price", () => {
    render(<PriceTick price={229.87} />);
    expect(screen.getByText("$229.87")).toBeInTheDocument();
  });

  it("flashes green when the price increases", () => {
    const { rerender } = render(<PriceTick price={100} />);
    const cell = screen.getByText("$100.00");
    expect(cell).toHaveAttribute("data-flash", "none");

    rerender(<PriceTick price={101} />);
    expect(cell).toHaveAttribute("data-flash", "up");
    expect(cell.className).toContain("emerald");
  });

  it("flashes red when the price decreases", () => {
    const { rerender } = render(<PriceTick price={100} />);
    rerender(<PriceTick price={99} />);
    expect(screen.getByText("$99.00")).toHaveAttribute("data-flash", "down");
  });

  it("clears the flash after the duration", () => {
    jest.useFakeTimers();
    try {
      const { rerender } = render(<PriceTick price={100} flashDuration={500} />);
      rerender(<PriceTick price={101} flashDuration={500} />);
      const cell = screen.getByText("$101.00");
      expect(cell).toHaveAttribute("data-flash", "up");
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(cell).toHaveAttribute("data-flash", "none");
    } finally {
      jest.useRealTimers();
    }
  });
});
