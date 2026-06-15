import { createClient } from "@/lib/supabase/client";

function callbackUrl(redirectedFrom?: string | null): string {
  const base = `${window.location.origin}/auth/callback`;
  if (!redirectedFrom) {
    return base;
  }
  return `${base}?redirectedFrom=${encodeURIComponent(redirectedFrom)}`;
}

export async function signInWithGoogle(redirectedFrom?: string | null): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl(redirectedFrom),
    },
  });
  if (error) {
    throw error;
  }
}

export async function signInWithMagicLink(
  email: string,
  redirectedFrom?: string | null
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl(redirectedFrom),
    },
  });
  if (error) {
    throw error;
  }
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}
