-- Phase 2.5: enable Supabase Realtime on watchlists so the web watchlist
-- panel reflects add/remove changes live across sessions.

alter publication supabase_realtime add table public.watchlists;

-- watchlists already has select/insert/delete RLS from the Phase 1 schema.
-- Allow upsert (insert-or-ignore) to keep add idempotent under RLS.
create policy "watchlists_update_own" on public.watchlists
  for update using (auth.uid() = user_id);
