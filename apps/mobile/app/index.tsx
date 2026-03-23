import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

// Root index — redirects based on auth state
export default function Index() {
  const { session, isLoading } = useAuth();

  // Show blank screen with cream background while checking session
  if (isLoading) {
    return <View className="flex-1 bg-cream-50" />;
  }

  if (session) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
