import { useCallback, useRef } from 'react';
import { Redirect, Tabs } from 'expo-router';
import { Alert, Platform, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';

export default function AppLayout() {
  const { session, isLoading } = useAuth();
  const resetTimerRef = useRef<() => void>(() => {});

  const handleIdleWarning = useCallback(() => {
    Alert.alert('אזהרת חוסר פעילות', 'תנותק בעוד 5 דקות בגלל חוסר פעילות.', [
      { text: 'הישאר מחובר', onPress: () => resetTimerRef.current() },
    ]);
  }, []);

  const { resetTimer } = useIdleTimeout(handleIdleWarning);
  resetTimerRef.current = resetTimer;

  // Still loading — don't redirect yet
  if (isLoading) return null;

  // Not authenticated — redirect to login
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1 }} onTouchStart={resetTimer}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1B7A44',
          tabBarInactiveTintColor: '#A8A49D',
          tabBarLabelStyle: {
            fontFamily: 'Rubik-Medium',
            fontSize: 10,
          },
          tabBarStyle: {
            backgroundColor: 'rgba(254,253,251,0.92)',
            borderTopColor: '#F5EFE6',
            borderTopWidth: 1,
            paddingTop: 6,
            paddingBottom: Platform.OS === 'ios' ? 22 : 8,
            height: Platform.OS === 'ios' ? 80 : 60,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'בית',
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'דוחות',
            tabBarIcon: ({ color, size }) => (
              <Feather name="file-text" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: 'פרויקטים',
            tabBarIcon: ({ color, size }) => (
              <Feather name="folder" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'הגדרות',
            tabBarIcon: ({ color, size }) => (
              <Feather name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
