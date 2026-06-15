import { Text, View } from "react-native";
import { ScreenShell } from "@/src/components/ScreenShell";

export default function HomeScreen() {
  return (
    <ScreenShell title="Home" subtitle="Your portfolio at a glance">
      <View className="rounded-2xl bg-surface p-5">
        <Text className="text-sm text-muted">Portfolio value</Text>
        <Text className="mt-1 font-mono text-3xl font-bold text-foreground">$100,000.00</Text>
        <Text className="mt-1 font-mono text-sm text-bull">+$0.00 (0.00%) all time</Text>
      </View>
      <Text className="mt-6 text-sm text-muted">
        Top movers and your watchlist arrive in Phase 2.
      </Text>
    </ScreenShell>
  );
}
