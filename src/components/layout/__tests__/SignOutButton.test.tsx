import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import SignOutButton from "@/components/layout/SignOutButton";
import { signOut } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({
  signOut: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn() },
}));

beforeEach(() => {
  (signOut as jest.Mock).mockReset();
  (toast.error as jest.Mock).mockClear();
});

describe("SignOutButton", () => {
  it("signs out and redirects to /login on success", async () => {
    (signOut as jest.Mock).mockResolvedValue(undefined);
    render(<SignOutButton />);

    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1));
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows an error toast when sign-out fails", async () => {
    (signOut as jest.Mock).mockRejectedValue(new Error("network"));
    render(<SignOutButton />);

    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Could not sign out. Try again."));
  });
});
