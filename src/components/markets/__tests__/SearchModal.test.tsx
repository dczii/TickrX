import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import SearchModal from "@/components/markets/SearchModal";

describe("SearchModal", () => {
  it("renders nothing when closed and the dialog when open", () => {
    const { rerender } = render(
      <SearchModal
        open={false}
        onClose={jest.fn()}
        onSearch={jest.fn().mockResolvedValue([])}
        onSelect={jest.fn()}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <SearchModal
        open
        onClose={jest.fn()}
        onSearch={jest.fn().mockResolvedValue([])}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByRole("dialog", { name: "Search tickers" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Search ticker/ })).toHaveFocus();
  });

  it("debounces input and renders filtered results", async () => {
    const onSearch = jest.fn().mockResolvedValue([{ symbol: "AAPL", name: "Apple Inc." }]);
    render(
      <SearchModal
        open
        onClose={jest.fn()}
        onSearch={onSearch}
        onSelect={jest.fn()}
        debounceMs={0}
      />
    );

    fireEvent.change(screen.getByRole("textbox", { name: /Search ticker/ }), {
      target: { value: "AAP" },
    });

    await waitFor(() => expect(onSearch).toHaveBeenCalledWith("AAP"));
    expect(await screen.findByRole("option", { name: /AAPL/ })).toBeInTheDocument();
  });

  it("selects a result on click and closes", async () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    const onSearch = jest.fn().mockResolvedValue([{ symbol: "AAPL", name: "Apple Inc." }]);
    render(
      <SearchModal open onClose={onClose} onSearch={onSearch} onSelect={onSelect} debounceMs={0} />
    );

    fireEvent.change(screen.getByRole("textbox", { name: /Search ticker/ }), {
      target: { value: "AAP" },
    });

    await screen.findByRole("option", { name: /AAPL/ });
    fireEvent.click(screen.getByRole("button", { name: /AAPL/ }));

    expect(onSelect).toHaveBeenCalledWith("AAPL");
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on Escape and on backdrop click", () => {
    const onClose = jest.fn();
    render(
      <SearchModal
        open
        onClose={onClose}
        onSearch={jest.fn().mockResolvedValue([])}
        onSelect={jest.fn()}
      />
    );
    fireEvent.keyDown(screen.getByRole("textbox", { name: /Search ticker/ }), { key: "Escape" });
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
