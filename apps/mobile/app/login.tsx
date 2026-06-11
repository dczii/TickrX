import { Redirect } from 'expo-router';
import { TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { signInWithGoogle } from '@/src/lib/auth';
import { useAuth } from '@/src/providers/AuthProvider';

export default function LoginScreen() {
  const { session, isLoading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isLoading && session) {
    return <Redirect href="/(tabs)" />;
  }

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Sign-in failed. Try again.'
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <View className="mb-12 items-center">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised">
          <TrendingUp color="#34D399" size={32} />
        </View>
        <Text className="text-4xl font-bold text-foreground">TickrX</Text>
        <Text className="mt-2 text-center text-base text-muted">
          Paper trade US stocks with $100,000 in virtual cash
        </Text>
      </View>

      <Pressable
        testID="google-sign-in"
        accessibilityRole="button"
        disabled={isSigningIn}
        onPress={handleSignIn}
        className="w-full flex-row items-center justify-center rounded-xl bg-accent px-6 py-4 active:opacity-80 disabled:opacity-50"
      >
        {isSigningIn ? (
          <ActivityIndicator color="#0A0E14" />
        ) : (
          <Text className="text-base font-semibold text-background">
            Continue with Google
          </Text>
        )}
      </Pressable>

      {errorMessage ? (
        <Text testID="login-error" className="mt-4 text-center text-sm text-bear">
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}
