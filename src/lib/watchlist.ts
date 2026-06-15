import type { SupabaseClient } from "@supabase/supabase-js";

export async function getWatchlist(supabase: SupabaseClient, userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("watchlists")
    .select("symbol")
    .eq("user_id", userId)
    .order("added_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row: { symbol: string }) => row.symbol);
}

export async function addToWatchlist(
  supabase: SupabaseClient,
  userId: string,
  symbol: string
): Promise<void> {
  const normalized = symbol.trim().toUpperCase();
  if (!normalized) {
    throw new Error("Symbol is required");
  }

  const { error } = await supabase
    .from("watchlists")
    .upsert(
      { user_id: userId, symbol: normalized },
      { onConflict: "user_id,symbol", ignoreDuplicates: true }
    );

  if (error) {
    throw error;
  }
}

export async function removeFromWatchlist(
  supabase: SupabaseClient,
  userId: string,
  symbol: string
): Promise<void> {
  const { error } = await supabase
    .from("watchlists")
    .delete()
    .eq("user_id", userId)
    .eq("symbol", symbol.trim().toUpperCase());

  if (error) {
    throw error;
  }
}
