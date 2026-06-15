import type { SupabaseClient } from "@supabase/supabase-js";

export const STARTING_BALANCE = 100000.0;

export interface Portfolio {
  id: string;
  user_id: string;
  cash_balance: number;
  starting_balance: number;
}

/**
 * Idempotently guarantees the signed-in user owns a $100,000 virtual portfolio.
 * The signup DB trigger creates this row for new OAuth users; this is the
 * fallback path for magic-link or pre-existing accounts on first login.
 */
export async function ensurePortfolio(
  supabase: SupabaseClient,
  userId: string
): Promise<Portfolio> {
  const { data: existing, error: selectError } = await supabase
    .from("portfolios")
    .select("id, user_id, cash_balance, starting_balance")
    .eq("user_id", userId)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existing) {
    return existing as Portfolio;
  }

  const { data: created, error: insertError } = await supabase
    .from("portfolios")
    .insert({
      user_id: userId,
      cash_balance: STARTING_BALANCE,
      starting_balance: STARTING_BALANCE,
    })
    .select("id, user_id, cash_balance, starting_balance")
    .single();

  if (insertError) {
    throw insertError;
  }

  return created as Portfolio;
}
