import { render, screen, fireEvent, within } from "@testing-library/react";

import DataTable, { type Column } from "@/components/markets/DataTable";

interface Row {
  symbol: string;
  changePct: number;
}

const rows: Row[] = [
  { symbol: "AAA", changePct: 1 },
  { symbol: "BBB", changePct: -2 },
  { symbol: "CCC", changePct: 3 },
];

const columns: Column<Row>[] = [
  { key: "symbol", label: "Ticker", sortable: true },
  { key: "changePct", label: "Change", sortable: true, align: "right" },
];

function bodySymbols(): string[] {
  const table = screen.getByRole("table");
  const [, body] = within(table).getAllByRole("rowgroup");
  return within(body)
    .getAllByRole("row")
    .map((r) => within(r).getAllByRole("cell")[0].textContent ?? "");
}

describe("DataTable", () => {
  it("renders rows with the initial sort applied", () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.symbol}
        initialSortKey="changePct"
        initialSortDir="desc"
      />
    );
    expect(bodySymbols()).toEqual(["CCC", "AAA", "BBB"]);
  });

  it("sorts by a column when its header is clicked, and toggles direction", () => {
    render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.symbol} />);

    fireEvent.click(screen.getByRole("button", { name: /Change/ }));
    expect(bodySymbols()).toEqual(["CCC", "AAA", "BBB"]);

    fireEvent.click(screen.getByRole("button", { name: /Change/ }));
    expect(bodySymbols()).toEqual(["BBB", "AAA", "CCC"]);
  });

  it("exposes aria-sort on the active column", () => {
    render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.symbol} />);
    fireEvent.click(screen.getByRole("button", { name: /Ticker/ }));
    const header = screen.getByRole("columnheader", { name: /Ticker/ });
    expect(header).toHaveAttribute("aria-sort", "descending");
  });
});
