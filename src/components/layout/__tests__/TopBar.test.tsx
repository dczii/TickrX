import { render, screen, fireEvent } from "@testing-library/react";

import TopBar from "@/components/layout/TopBar";

const setQuery = jest.fn();

jest.mock("nuqs", () => ({
  useQueryState: () => ["", setQuery],
}));

jest.mock("@/components/TickrTape", () => ({
  TickerTape: () => <div data-testid="ticker-tape" />,
}));

describe("TopBar", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the ticker tape, search, and notifications", () => {
    render(<TopBar />);
    expect(screen.getByTestId("ticker-tape")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search ticker" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
  });

  it("focuses the search input on ⌘K", () => {
    render(<TopBar />);
    const input = screen.getByRole("searchbox", { name: "Search ticker" });
    expect(input).not.toHaveFocus();

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    expect(input).toHaveFocus();
  });

  it("pushes typed input into URL state", () => {
    render(<TopBar />);
    const input = screen.getByRole("searchbox", { name: "Search ticker" });

    fireEvent.change(input, { target: { value: "AAPL" } });

    expect(setQuery).toHaveBeenCalledWith("AAPL");
  });
});
