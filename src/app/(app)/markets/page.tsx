import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getMarketSnapshot } from "@/lib/polygon";
import { getWatchlist } from "@/lib/watchlist";
import { mockSectors } from "@/lib/markets";
import MarketsView from "@/components/markets/MarketsView";

export default async function MarketsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [rows, watchlist] = await Promise.all([
    getMarketSnapshot(),
    getWatchlist(supabase, user.id).catch(() => []),
  ]);

  return (
    <MarketsView
      userId={user.id}
      initialRows={rows}
      sectors={mockSectors()}
      initialWatchlist={watchlist}
    />
  );
}
