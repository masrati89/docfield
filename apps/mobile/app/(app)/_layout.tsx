import { useCallback, useRef } from 'react';
import { Redirect, Tabs, useSegments } from 'expo-router';
import { Alert, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';

const TAB_ICON_SIZE = 22;

export default function AppLayout() {
  const { session, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const resetTimerRef = useRef<() => void>(() => {});

  const handleIdleWarning = useCallback(() => {
    Alert.alert('אזהרת חוסר פעילות', 'תנותק בעוד 5 דקות בגלל חוסר פעילות.', [
      { text: 'הישאר מחובר', onPress: () => resetTimerRef.current() },
    ]);
  }, []);

  const { resetTimer } = useIdleTimeout(handleIdleWarning);
  resetTimerRef.current = resetTimer;

  // All hooks must be called before any early return (Rules of Hooks)
  const segments = useSegments();

  // Still loading — don't redirect yet
  if (isLoading) return null;

  // Not authenticated — redirect to login
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  const bottomPadding = Math.max(insets.bottom, 8);

  // Hide tab bar when inside report detail/editing screens
  const isInsideReport =
    segments.includes('reports' as never) &&
    segments.some((s) => s !== 'reports' && s !== '(app)' && s !== 'index');

  const tabBarStyle = isInsideReport
    ? { display: 'none' as const }
    : {
        backgroundColor: 'rgba(254,253,251,0.92)' as const,
        borderTopColor: '#F5EFE6',
        borderTopWidth: 1,
        paddingTop: 6,
        paddingBottom: bottomPadding + 4,
        height: 60 + bottomPadding,
      };

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
          tabBarStyle,
        }}
      >
        {/* RTL order: rightmost first → leftmost last */}
        <Tabs.Screen
          name="settings"
          options={{
            title: 'הגדרות',
            tabBarIcon: ({ color }) => (
              <Feather name="settings" size={TAB_ICON_SIZE} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: 'פרויקטים',
            tabBarIcon: ({ color }) => (
              <Feather name="folder" size={TAB_ICON_SIZE} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'דוחות',
            tabBarIcon: ({ color }) => (
              <Feather name="file-text" size={TAB_ICON_SIZE} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'בית',
            tabBarIcon: ({ color }) => (
              <Feather name="home" size={TAB_ICON_SIZE} color={color} />
            ),
          }}
        />
        {/* Hidden from tab bar — accessible via side menu */}
        <Tabs.Screen
          name="library"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}
