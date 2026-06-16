import { act, render, screen } from "@testing-library/react";

import StatusBar from "@/components/layout/StatusBar";

describe("StatusBar", () => {
  it("renders the current time after mount", () => {
    render(<StatusBar />);
    expect(screen.getByText(/\d{1,2}:\d{2}\s?(AM|PM)/i)).toBeInTheDocument();
  });

  it("updates the displayed time on the 30s interval", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-01T09:00:00"));
    render(<StatusBar />);
    expect(screen.getByText(/9:00/)).toBeInTheDocument();

    act(() => {
      jest.setSystemTime(new Date("2026-01-01T09:01:00"));
      jest.advanceTimersByTime(30_000);
    });
    expect(screen.getByText(/9:01/)).toBeInTheDocument();

    jest.useRealTimers();
  });
});
