import { LogOut } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ScreenShell } from '@/src/components/ScreenShell';
import { signOut } from '@/src/lib/auth';
import { useAuth } from '@/src/providers/AuthProvider';

export default function ProfileScreen() {
  const { session } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignOut = async () => {
    setErrorMessage(null);
    try {
      await signOut();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Sign-out failed. Try again.'
      );
    }
  };

  return (
    <ScreenShell title="Profile" subtitle="Account and preferences">
      <View className="rounded-2xl bg-surface p-5">
        <Text className="text-sm text-muted">Signed in as</Text>
        <Text className="mt-1 text-base text-foreground">
          {session?.user.email ?? 'Unknown'}
        </Text>
      </View>

      <Pressable
        testID="sign-out"
        accessibilityRole="button"
        onPress={handleSignOut}
        className="mt-6 flex-row items-center justify-center rounded-xl border border-border bg-surface px-6 py-4 active:opacity-80"
      >
        <LogOut color="#F87171" size={18} />
        <Text className="ml-2 text-base font-semibold text-bear">Sign out</Text>
      </Pressable>

      {errorMessage ? (
        <Text className="mt-4 text-center text-sm text-bear">
          {errorMessage}
        </Text>
      ) : null}
    </ScreenShell>
  );
}
