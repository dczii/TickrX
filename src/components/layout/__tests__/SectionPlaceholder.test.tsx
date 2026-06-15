import { render, screen } from "@testing-library/react";

import SectionPlaceholder from "@/components/layout/SectionPlaceholder";

describe("SectionPlaceholder", () => {
  it("renders the title, description, and arrival phase", () => {
    render(
      <SectionPlaceholder
        title="Markets"
        description="Live prices and movers."
        comingIn="Phase 2.5"
      />
    );

    expect(screen.getByRole("heading", { name: "Markets" })).toBeInTheDocument();
    expect(screen.getByText("Live prices and movers.")).toBeInTheDocument();
    expect(screen.getByText("Arriving in Phase 2.5.")).toBeInTheDocument();
  });
});
