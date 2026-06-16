import { render, screen, fireEvent } from "@testing-library/react";

import HoldingsTable from "@/components/portfolio/HoldingsTable";
import { DEMO_HOLDINGS } from "@/lib/demoData";

const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

beforeEach(() => jest.clearAllMocks());

describe("HoldingsTable", () => {
  it("renders a row per holding with computed allocation", () => {
    render(<HoldingsTable holdings={DEMO_HOLDINGS} totalValue={100000} />);
    expect(screen.getByText("NVDA")).toBeInTheDocument();
    // NVDA value 23121.90 / 100000 = 23.1%
    expect(screen.getByText("23.1%")).toBeInTheDocument();
  });

  it("navigates to the stock page on row click", () => {
    render(<HoldingsTable holdings={DEMO_HOLDINGS} totalValue={100000} />);
    fireEvent.click(screen.getByText("AAPL"));
    expect(push).toHaveBeenCalledWith("/stock/AAPL");
  });
});
