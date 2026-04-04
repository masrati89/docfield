import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';

export default function AuthLayout() {
  const { session, isLoading } = useAuth();

  // Still loading — don't redirect yet
  if (isLoading) return null;

  // Already authenticated — redirect to app
  if (session) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    />
  );
}
