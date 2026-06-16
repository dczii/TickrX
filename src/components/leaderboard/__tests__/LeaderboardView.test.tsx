import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";

import LeaderboardView from "@/components/leaderboard/LeaderboardView";
import { DEMO_LEADERS } from "@/lib/demoData";

const success = jest.fn();
jest.mock("sonner", () => ({
  toast: { success: (...args: unknown[]) => success(...args) },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ back: jest.fn() });
});

describe("LeaderboardView", () => {
  it("renders every leader and marks the current user", () => {
    render(<LeaderboardView leaders={DEMO_LEADERS} />);
    expect(screen.getByText("Maya Okonkwo")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
  });

  it("toggles between weekly and all-time", () => {
    render(<LeaderboardView leaders={DEMO_LEADERS} />);
    const weekly = screen.getByRole("button", { name: "Weekly" });
    fireEvent.click(weekly);
    expect(weekly).toHaveAttribute("aria-pressed", "true");
  });

  it("fires a copy toast and hides the copy button for the current user", () => {
    render(<LeaderboardView leaders={DEMO_LEADERS} />);
    const copyButtons = screen.getAllByRole("button", { name: "Copy" });
    // 7 leaders, one is "me" → 6 copy buttons
    expect(copyButtons).toHaveLength(DEMO_LEADERS.filter((l) => !l.me).length);
    fireEvent.click(copyButtons[0]);
    expect(success).toHaveBeenCalled();
  });
});
