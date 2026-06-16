import { render } from "@testing-library/react";

import Sparkline from "@/components/charts/Sparkline";
import AreaChart from "@/components/charts/AreaChart";

describe("chart components", () => {
  it("renders a sparkline polyline", () => {
    const { container } = render(<Sparkline seed={3} positive />);
    expect(container.querySelector("polyline")).toBeInTheDocument();
    expect(container.querySelector("polygon")).not.toBeInTheDocument();
  });

  it("renders a sparkline fill polygon when fill is set", () => {
    const { container } = render(<Sparkline seed={3} positive={false} fill />);
    expect(container.querySelector("polygon")).toBeInTheDocument();
  });

  it("renders an area chart with a gradient", () => {
    const { container } = render(<AreaChart seed={7} positive />);
    expect(container.querySelector("linearGradient")).toBeInTheDocument();
    expect(container.querySelector("polyline")).toBeInTheDocument();
  });
});
