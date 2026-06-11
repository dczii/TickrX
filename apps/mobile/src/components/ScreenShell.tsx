import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenShellProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function ScreenShell({ title, subtitle, children }: ScreenShellProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="border-b border-border px-4 pb-3 pt-2">
        <Text className="text-2xl font-bold text-foreground">{title}</Text>
        {subtitle ? (
          <Text className="mt-1 text-sm text-muted">{subtitle}</Text>
        ) : null}
      </View>
      <View className="flex-1 px-4 pt-4">{children}</View>
    </SafeAreaView>
  );
}
