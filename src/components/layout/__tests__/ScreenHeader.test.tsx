import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import ScreenHeader from "@/components/layout/ScreenHeader";

const back = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  back.mockClear();
  (useRouter as jest.Mock).mockReturnValue({ back });
});

describe("ScreenHeader", () => {
  it("renders a root-tab header with subtitle and right actions", () => {
    render(<ScreenHeader title="Markets" subtitle="Good morning" right={<span>Bell</span>} />);

    expect(screen.getByRole("heading", { name: "Markets" })).toBeInTheDocument();
    expect(screen.getByText("Good morning")).toBeInTheDocument();
    expect(screen.getByText("Bell")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument();
  });

  it("renders a back header that navigates to the previous screen", () => {
    render(<ScreenHeader back title="AAPL" />);

    expect(screen.getByRole("heading", { name: "AAPL" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(back).toHaveBeenCalledTimes(1);
  });
});
