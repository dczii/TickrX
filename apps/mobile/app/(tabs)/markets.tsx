import { Text } from "react-native";
import { ScreenShell } from "@/src/components/ScreenShell";

export default function MarketsScreen() {
  return (
    <ScreenShell title="Markets" subtitle="Search, movers, and sectors">
      <Text className="text-sm text-muted">Live market data lands in Phase 2 (Polygon.io).</Text>
    </ScreenShell>
  );
}
