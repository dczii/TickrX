import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getWatchlist } from "@/lib/watchlist";
import WatchlistView from "@/components/markets/WatchlistView";

export default async function WatchlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const watchlist = await getWatchlist(supabase, user.id).catch(() => []);

  return <WatchlistView userId={user.id} initialWatchlist={watchlist} />;
}
