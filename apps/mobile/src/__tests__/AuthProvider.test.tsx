import { render, screen, waitFor, act } from "@testing-library/react-native";
import { Text } from "react-native";

const mockGetSession = jest.fn();
let authChangeCallback: ((event: string, session: unknown) => void) | undefined;
const mockUnsubscribe = jest.fn();

jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: (cb: (event: string, session: unknown) => void) => {
        authChangeCallback = cb;
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
      },
    },
  },
}));

import { AuthProvider, useAuth } from "@/src/providers/AuthProvider";

function Consumer() {
  const { session, isLoading } = useAuth();
  if (isLoading) {
    return <Text>loading</Text>;
  }
  return (
    <Text>{session ? `user:${(session as { user: { id: string } }).user.id}` : "signed-out"}</Text>
  );
}

const storedSession = { user: { id: "persisted-user" } };

beforeEach(() => {
  jest.clearAllMocks();
  authChangeCallback = undefined;
});

describe("AuthProvider", () => {
  it("restores a persisted session on mount (app restart)", async () => {
    mockGetSession.mockResolvedValue({ data: { session: storedSession } });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(screen.getByText("loading")).toBeTruthy();
    await waitFor(() => expect(screen.getByText("user:persisted-user")).toBeTruthy());
  });

  it("shows signed-out when no session is persisted", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText("signed-out")).toBeTruthy());
  });

  it("updates when auth state changes", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText("signed-out")).toBeTruthy());

    act(() => {
      authChangeCallback?.("SIGNED_IN", { user: { id: "fresh-user" } });
    });

    await waitFor(() => expect(screen.getByText("user:fresh-user")).toBeTruthy());
  });

  it("unsubscribes from auth changes on unmount", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    const { unmount } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText("signed-out")).toBeTruthy());
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("ignores results that resolve after unmount", async () => {
    let resolveGetSession: (value: unknown) => void = () => undefined;
    mockGetSession.mockReturnValue(
      new Promise((resolve) => {
        resolveGetSession = resolve;
      })
    );

    const { unmount } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    unmount();
    await act(async () => {
      resolveGetSession({ data: { session: storedSession } });
    });
    authChangeCallback?.("SIGNED_IN", storedSession);
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("stops loading even if getSession rejects", async () => {
    mockGetSession.mockRejectedValue(new Error("storage unavailable"));

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText("signed-out")).toBeTruthy());
  });
});
