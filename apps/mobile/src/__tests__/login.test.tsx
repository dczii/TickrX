import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

const mockSignInWithGoogle = jest.fn();
jest.mock("@/src/lib/auth", () => ({
  signInWithGoogle: (...args: unknown[]) => mockSignInWithGoogle(...args),
}));

const mockUseAuth = jest.fn();
jest.mock("@/src/providers/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("expo-router", () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text: RNText } = jest.requireActual("react-native");
    return <RNText>{`redirect:${href}`}</RNText>;
  },
}));

import LoginScreen from "../../app/login";

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ session: null, isLoading: false });
});

describe("LoginScreen", () => {
  it("renders the brand and Google sign-in button", () => {
    render(<LoginScreen />);
    expect(screen.getByText("TickrX")).toBeTruthy();
    expect(screen.getByText("Continue with Google")).toBeTruthy();
  });

  it("starts the Google OAuth flow when pressed", async () => {
    mockSignInWithGoogle.mockResolvedValue(null);
    render(<LoginScreen />);

    fireEvent.press(screen.getByTestId("google-sign-in"));

    await waitFor(() => expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1));
  });

  it("shows an error message when sign-in fails", async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error("OAuth blocked"));
    render(<LoginScreen />);

    fireEvent.press(screen.getByTestId("google-sign-in"));

    await waitFor(() =>
      expect(screen.getByTestId("login-error")).toHaveTextContent("OAuth blocked")
    );
  });

  it("shows a generic message for non-Error failures", async () => {
    mockSignInWithGoogle.mockRejectedValue("boom");
    render(<LoginScreen />);

    fireEvent.press(screen.getByTestId("google-sign-in"));

    await waitFor(() =>
      expect(screen.getByTestId("login-error")).toHaveTextContent("Sign-in failed. Try again.")
    );
  });

  it("redirects to tabs when already signed in", () => {
    mockUseAuth.mockReturnValue({
      session: { user: { id: "u1" } },
      isLoading: false,
    });
    render(<LoginScreen />);
    expect(screen.getByText("redirect:/(tabs)")).toBeTruthy();
  });
});
