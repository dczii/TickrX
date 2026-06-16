import { DEMO_LEADERS } from "@/lib/demoData";
import LeaderboardView from "@/components/leaderboard/LeaderboardView";

export default function LeaderboardPage() {
  return <LeaderboardView leaders={DEMO_LEADERS} />;
}
