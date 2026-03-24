import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';

export default function AuthLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) return null;

  // If user is already authenticated, redirect to the app
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
