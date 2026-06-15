import { render, screen } from "@testing-library/react";

import SectorHeatmap from "@/components/markets/SectorHeatmap";

describe("SectorHeatmap", () => {
  it("renders a tile per sector with its change percentage", () => {
    render(
      <SectorHeatmap
        sectors={[
          { name: "Energy", changePct: 3.1 },
          { name: "Utilities", changePct: -2.4 },
        ]}
      />
    );
    expect(screen.getByText("Energy")).toBeInTheDocument();
    expect(screen.getByText("+3.10%")).toBeInTheDocument();
    expect(screen.getByText("-2.40%")).toBeInTheDocument();
  });

  it("colours tiles green for gains and red for losses", () => {
    render(
      <SectorHeatmap
        sectors={[
          { name: "Energy", changePct: 3.1 },
          { name: "Utilities", changePct: -2.4 },
        ]}
      />
    );
    const cells = screen.getAllByRole("gridcell");
    const energy = cells.find((c) => c.getAttribute("data-change") === "3.1");
    const utilities = cells.find((c) => c.getAttribute("data-change") === "-2.4");
    expect(energy?.style.backgroundColor).toContain("rgba(43, 214, 138");
    expect(utilities?.style.backgroundColor).toContain("rgba(255, 92, 114");
  });
});
