import { render, screen, fireEvent } from "@testing-library/react";

import OrderTicketPanel from "@/components/stock/OrderTicketPanel";

const success = jest.fn();
jest.mock("sonner", () => ({
  toast: { success: (...args: unknown[]) => success(...args) },
}));

beforeEach(() => jest.clearAllMocks());

function renderPanel(buyingPower = 10000) {
  return render(<OrderTicketPanel symbol="AAPL" price={200} buyingPower={buyingPower} />);
}

describe("OrderTicketPanel", () => {
  it("derives estimated shares from a dollar amount", () => {
    renderPanel();
    fireEvent.change(screen.getByLabelText("Dollar amount"), { target: { value: "1000" } });
    // $1000 / $200 = 5 shares
    expect(screen.getByText("5.0000")).toBeInTheDocument();
  });

  it("blocks a buy that exceeds buying power", () => {
    renderPanel(500);
    fireEvent.change(screen.getByLabelText("Dollar amount"), { target: { value: "1000" } });
    expect(screen.getByText(/Insufficient buying power/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm Buy" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Confirm Buy" }));
    expect(success).not.toHaveBeenCalled();
  });

  it("confirms a valid buy and fires a toast", () => {
    renderPanel();
    fireEvent.change(screen.getByLabelText("Dollar amount"), { target: { value: "1000" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirm Buy" }));
    expect(success).toHaveBeenCalledWith(
      expect.stringContaining("Bought"),
      expect.objectContaining({ description: expect.stringContaining("Market") })
    );
  });

  it("switches to sell mode", () => {
    renderPanel();
    fireEvent.click(screen.getByRole("button", { name: "sell" }));
    expect(screen.getByRole("button", { name: "Confirm Sell" })).toBeInTheDocument();
  });

  it("shows a limit price field when limit is selected", () => {
    renderPanel();
    fireEvent.click(screen.getByRole("button", { name: "limit" }));
    expect(screen.getByText("Limit Price")).toBeInTheDocument();
  });
});
