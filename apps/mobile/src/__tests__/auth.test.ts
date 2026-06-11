const mockSetSession = jest.fn();
const mockSignInWithOAuth = jest.fn();
const mockSignOut = jest.fn();

jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    auth: {
      setSession: (...args: unknown[]) => mockSetSession(...args),
      signInWithOAuth: (...args: unknown[]) => mockSignInWithOAuth(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
    },
  },
}));

const mockOpenAuthSessionAsync = jest.fn();
jest.mock("expo-web-browser", () => ({
  maybeCompleteAuthSession: jest.fn(),
  openAuthSessionAsync: (...args: unknown[]) => mockOpenAuthSessionAsync(...args),
}));

jest.mock("expo-auth-session", () => ({
  makeRedirectUri: () => "tickrx://auth",
}));

import { createSessionFromUrl, signInWithGoogle, signOut } from "@/src/lib/auth";

const fakeSession = { user: { id: "user-1" } };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("signInWithGoogle", () => {
  it("completes the OAuth flow and sets the session", async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: "https://accounts.google.com/auth" },
      error: null,
    });
    mockOpenAuthSessionAsync.mockResolvedValue({
      type: "success",
      url: "tickrx://auth#access_token=at&refresh_token=rt",
    });
    mockSetSession.mockResolvedValue({
      data: { session: fakeSession },
      error: null,
    });

    const session = await signInWithGoogle();

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: "tickrx://auth", skipBrowserRedirect: true },
    });
    expect(mockOpenAuthSessionAsync).toHaveBeenCalledWith(
      "https://accounts.google.com/auth",
      "tickrx://auth"
    );
    expect(mockSetSession).toHaveBeenCalledWith({
      access_token: "at",
      refresh_token: "rt",
    });
    expect(session).toEqual(fakeSession);
  });

  it("returns null when the user cancels the browser flow", async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: "https://accounts.google.com/auth" },
      error: null,
    });
    mockOpenAuthSessionAsync.mockResolvedValue({ type: "cancel" });

    const session = await signInWithGoogle();

    expect(session).toBeNull();
    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it("throws when Supabase returns an error", async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: new Error("oauth misconfigured"),
    });

    await expect(signInWithGoogle()).rejects.toThrow("oauth misconfigured");
  });

  it("throws when no OAuth URL is returned", async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: null,
    });

    await expect(signInWithGoogle()).rejects.toThrow("No OAuth URL returned from Supabase");
  });
});

describe("createSessionFromUrl", () => {
  it("returns null when tokens are missing", async () => {
    const session = await createSessionFromUrl("tickrx://auth");
    expect(session).toBeNull();
    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it("throws when the redirect contains an error code", async () => {
    await expect(createSessionFromUrl("tickrx://auth?errorCode=access_denied")).rejects.toThrow(
      "access_denied"
    );
  });

  it("propagates setSession errors", async () => {
    mockSetSession.mockResolvedValue({
      data: { session: null },
      error: new Error("invalid token"),
    });

    await expect(
      createSessionFromUrl("tickrx://auth#access_token=at&refresh_token=rt")
    ).rejects.toThrow("invalid token");
  });
});

describe("signOut", () => {
  it("signs out via Supabase", async () => {
    mockSignOut.mockResolvedValue({ error: null });
    await signOut();
    expect(mockSignOut).toHaveBeenCalled();
  });

  it("throws when sign-out fails", async () => {
    mockSignOut.mockResolvedValue({ error: new Error("network down") });
    await expect(signOut()).rejects.toThrow("network down");
  });
});
