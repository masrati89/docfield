import { useCallback, useEffect, useRef, useState } from 'react';
import { Redirect, Tabs, useSegments } from 'expo-router';
import { Modal, Pressable, Text, View, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StackActions, type NavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { useNotifications } from '@/hooks/useNotifications';
import { useSideMenu } from '@/hooks/useSideMenu';
import {
  SharedTabHeader,
  NotificationsPanel,
  NetworkBanner,
} from '@/components/ui';
import { SideMenu } from '@/components/ui/SideMenu';

const TAB_ICON_SIZE = 22;

function TabIcon({
  name,
  color,
  focused,
}: {
  name: keyof typeof Feather.glyphMap;
  color: string;
  focused: boolean;
}) {
  return (
    <View
      style={{
        width: focused ? 48 : 40,
        height: 30,
        borderRadius: 15,
        backgroundColor: focused ? COLORS.primary[50] : 'transparent',
        borderWidth: 1,
        borderColor: focused ? COLORS.primary[200] : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Feather
        name={name}
        size={TAB_ICON_SIZE}
        color={focused ? COLORS.primary[600] : color}
      />
    </View>
  );
}

export default function AppLayout() {
  const { session, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const resetTimerRef = useRef<() => void>(() => {});
  const { isOpen: menuOpen, open: openMenu, close: closeMenu } = useSideMenu();
  const { unreadCount: notificationCount } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [idleWarningVisible, setIdleWarningVisible] = useState(false);

  const handleIdleWarning = useCallback(() => {
    setIdleWarningVisible(true);
  }, []);

  const { resetTimer } = useIdleTimeout(handleIdleWarning);
  resetTimerRef.current = resetTimer;

  const segments = useSegments();

  // Navigation state flags — computed before animation hooks that depend on them
  const isInsideReport =
    segments.includes('reports' as never) &&
    segments.some((s) => s !== 'reports' && s !== '(app)' && s !== 'index');

  const isInsideProject =
    segments.includes('projects' as never) &&
    segments.some((s) => s !== 'projects' && s !== '(app)' && s !== 'index');

  const isHomeTab =
    !segments.includes('reports' as never) &&
    !segments.includes('projects' as never) &&
    !segments.includes('settings' as never) &&
    !segments.includes('library' as never) &&
    !segments.includes('statistics' as never) &&
    !segments.includes('help' as never);

  const isNestedScreen = isInsideReport || isInsideProject;
  const showSharedHeader = !isNestedScreen && !isHomeTab;

  // --- SharedTabHeader smooth height + opacity animation ---
  // Height = paddingTop(insets.top + 4) + content(36) + paddingBottom(8) + border(1)
  const sharedHeaderFullHeight = insets.top + 49;
  const headerAnim = useSharedValue(showSharedHeader ? 1 : 0);

  useEffect(() => {
    headerAnim.value = withTiming(showSharedHeader ? 1 : 0, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    });
  }, [showSharedHeader, headerAnim]);

  const headerWrapperStyle = useAnimatedStyle(
    () => ({
      height: headerAnim.value * sharedHeaderFullHeight,
      opacity: headerAnim.value,
      overflow: 'hidden' as const,
    }),
    [sharedHeaderFullHeight]
  );

  // --- Early returns (all hooks called above) ---
  if (isLoading) return null;
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  const bottomPadding = Math.max(insets.bottom, 8);

  // Tab bar: always rendered (position absolute), opacity hides when in nested screens
  const tabBarStyle = {
    backgroundColor:
      Platform.OS === 'ios'
        ? 'transparent'
        : ('rgba(254,253,251,0.94)' as const),
    borderTopColor: '#F5EFE6',
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: bottomPadding + 4,
    height: 60 + bottomPadding,
    position: 'absolute' as const,
    elevation: 0,
    opacity: isNestedScreen ? 0 : 1,
  };

  return (
    <View style={{ flex: 1 }} onTouchStart={resetTimer}>
      <NetworkBanner />

      {/* SharedTabHeader — always rendered, animated height + opacity */}
      <Animated.View
        style={headerWrapperStyle}
        pointerEvents={showSharedHeader ? 'auto' : 'none'}
      >
        <SharedTabHeader
          notificationCount={notificationCount}
          onBell={() => setNotificationsOpen(true)}
          onMenu={openMenu}
        />
      </Animated.View>

      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          tabBarActiveTintColor: '#1B7A44',
          tabBarInactiveTintColor: '#A8A49D',
          tabBarLabelStyle: {
            fontFamily: 'Rubik-Medium',
            fontSize: 10,
          },
          tabBarStyle,
          tabBarBackground: () =>
            Platform.OS === 'ios' && !isNestedScreen ? (
              <BlurView
                intensity={18}
                tint="light"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            ) : null,
        }}
      >
        {/* RTL order: rightmost first → leftmost last */}
        <Tabs.Screen
          name="settings"
          options={{
            title: 'הגדרות',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="settings" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: 'פרויקטים',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="folder" color={color} focused={focused} />
            ),
          }}
          listeners={({ navigation, route }) => ({
            blur: () => {
              const r = route as typeof route & { state?: NavigationState };
              if (r.state && r.state.index > 0) {
                navigation.dispatch({
                  ...StackActions.popToTop(),
                  target: r.state.key,
                });
              }
            },
          })}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'דוחות',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="file-text" color={color} focused={focused} />
            ),
          }}
          listeners={({ navigation, route }) => ({
            blur: () => {
              const r = route as typeof route & { state?: NavigationState };
              if (r.state && r.state.index > 0) {
                navigation.dispatch({
                  ...StackActions.popToTop(),
                  target: r.state.key,
                });
              }
            },
          })}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'בית',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="home" color={color} focused={focused} />
            ),
          }}
        />
        {/* Hidden from tab bar — accessible via ToolGrid / side menu */}
        <Tabs.Screen
          name="library"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="help"
          options={{
            href: null,
          }}
        />
      </Tabs>

      <SideMenu visible={menuOpen} onClose={closeMenu} />
      <NotificationsPanel
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Idle warning modal (replaces Alert.alert for cross-platform) */}
      <Modal
        visible={idleWarningVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIdleWarningVisible(false)}
      >
        <Pressable
          onPress={() => setIdleWarningVisible(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              width: '100%',
              maxWidth: 320,
              backgroundColor: COLORS.cream[50],
              borderRadius: 14,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[800],
                textAlign: 'right',
                marginBottom: 8,
              }}
            >
              אזהרת חוסר פעילות
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[600],
                textAlign: 'right',
                marginBottom: 20,
              }}
            >
              תנותק בעוד 5 דקות בגלל חוסר פעילות.
            </Text>
            <Pressable
              onPress={() => {
                resetTimerRef.current();
                setIdleWarningVisible(false);
              }}
              style={{
                height: 40,
                borderRadius: 10,
                backgroundColor: COLORS.primary[500],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik-SemiBold',
                  color: COLORS.white,
                }}
              >
                הישאר מחובר
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
