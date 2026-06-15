import { signInWithGoogle, signInWithMagicLink, signOut } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(),
}));

const signInWithOAuth = jest.fn();
const signInWithOtp = jest.fn();
const supabaseSignOut = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  signInWithOAuth.mockResolvedValue({ error: null });
  signInWithOtp.mockResolvedValue({ error: null });
  supabaseSignOut.mockResolvedValue({ error: null });
  (createClient as jest.Mock).mockReturnValue({
    auth: {
      signInWithOAuth,
      signInWithOtp,
      signOut: supabaseSignOut,
    },
  });
});

describe("signInWithGoogle", () => {
  it("requests Google OAuth with the callback redirect", async () => {
    await signInWithGoogle();

    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: "http://localhost/auth/callback" },
    });
  });

  it("preserves the originating route in the redirect", async () => {
    await signInWithGoogle("/portfolio");

    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: "http://localhost/auth/callback?redirectedFrom=%2Fportfolio" },
    });
  });

  it("throws when Supabase returns an error", async () => {
    signInWithOAuth.mockResolvedValue({ error: new Error("oauth down") });

    await expect(signInWithGoogle()).rejects.toThrow("oauth down");
  });
});

describe("signInWithMagicLink", () => {
  it("sends an OTP email with the callback redirect", async () => {
    await signInWithMagicLink("user@example.com");

    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "user@example.com",
      options: { emailRedirectTo: "http://localhost/auth/callback" },
    });
  });

  it("throws when Supabase returns an error", async () => {
    signInWithOtp.mockResolvedValue({ error: new Error("smtp fail") });

    await expect(signInWithMagicLink("user@example.com")).rejects.toThrow("smtp fail");
  });
});

describe("signOut", () => {
  it("calls Supabase sign out", async () => {
    await signOut();
    expect(supabaseSignOut).toHaveBeenCalled();
  });

  it("throws when Supabase returns an error", async () => {
    supabaseSignOut.mockResolvedValue({ error: new Error("nope") });
    await expect(signOut()).rejects.toThrow("nope");
  });
});
