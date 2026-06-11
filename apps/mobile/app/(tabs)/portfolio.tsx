import { Text } from 'react-native';
import { ScreenShell } from '@/src/components/ScreenShell';

export default function PortfolioScreen() {
  return (
    <ScreenShell title="Portfolio" subtitle="Holdings and performance">
      <Text className="text-sm text-muted">
        Holdings, P&L, and trade history land in Phase 4.
      </Text>
    </ScreenShell>
  );
}
