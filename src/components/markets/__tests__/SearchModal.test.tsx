import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import SearchModal from "@/components/markets/SearchModal";

function openWithCmdK() {
  fireEvent.keyDown(window, { key: "k", metaKey: true });
}

describe("SearchModal", () => {
  it("is closed until ⌘K is pressed", () => {
    render(<SearchModal onSearch={jest.fn().mockResolvedValue([])} onSelect={jest.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    openWithCmdK();
    expect(screen.getByRole("dialog", { name: "Search tickers" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Search ticker/ })).toHaveFocus();
  });

  it("debounces input and renders filtered results", async () => {
    const onSearch = jest.fn().mockResolvedValue([{ symbol: "AAPL", name: "Apple Inc." }]);
    render(<SearchModal onSearch={onSearch} onSelect={jest.fn()} debounceMs={0} />);

    openWithCmdK();
    fireEvent.change(screen.getByRole("textbox", { name: /Search ticker/ }), {
      target: { value: "AAP" },
    });

    await waitFor(() => expect(onSearch).toHaveBeenCalledWith("AAP"));
    expect(await screen.findByRole("option", { name: /AAPL/ })).toBeInTheDocument();
  });

  it("selects a result on click and closes", async () => {
    const onSelect = jest.fn();
    const onSearch = jest.fn().mockResolvedValue([{ symbol: "AAPL", name: "Apple Inc." }]);
    render(<SearchModal onSearch={onSearch} onSelect={onSelect} debounceMs={0} />);

    openWithCmdK();
    fireEvent.change(screen.getByRole("textbox", { name: /Search ticker/ }), {
      target: { value: "AAP" },
    });

    await screen.findByRole("option", { name: /AAPL/ });
    fireEvent.click(screen.getByRole("button", { name: /AAPL/ }));

    expect(onSelect).toHaveBeenCalledWith("AAPL");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes on Escape", () => {
    render(<SearchModal onSearch={jest.fn().mockResolvedValue([])} onSelect={jest.fn()} />);
    openWithCmdK();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
