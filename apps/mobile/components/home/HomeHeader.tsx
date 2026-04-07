import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';

// --- Types ---

interface HomeHeaderProps {
  userName: string;
  notificationCount?: number;
  onNewInspection?: () => void;
  onBell?: () => void;
  onMenu?: () => void;
}

// --- Component ---

export function HomeHeader({
  userName,
  notificationCount = 0,
  onNewInspection,
  onBell,
  onMenu,
}: HomeHeaderProps) {
  const handleNewInspection = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onNewInspection?.();
  };

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
      {/* Top bar: bell — logo — hamburger (RTL: bell=left, hamburger=right) */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Hamburger (right in RTL) */}
        <Pressable
          onPress={onMenu}
          style={{
            width: 36,
            height: 36,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="menu" size={20} color={COLORS.neutral[700]} />
        </Pressable>

        {/* Logo center */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              backgroundColor: COLORS.primary[50],
              borderWidth: 1,
              borderColor: COLORS.primary[200],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="clipboard" size={16} color={COLORS.primary[500]} />
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: COLORS.primary[700],
              fontFamily: 'Rubik-Bold',
              letterSpacing: 0,
            }}
          >
            inField
          </Text>
        </View>

        {/* Bell button (left in RTL) */}
        <Pressable
          onPress={onBell}
          style={{
            width: 36,
            height: 36,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="bell" size={19} color={COLORS.neutral[500]} />
          {/* Notification badge — only visible when there are unread notifications */}
          {notificationCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                minWidth: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: COLORS.danger[500],
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: COLORS.cream[50],
                paddingHorizontal: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  color: COLORS.white,
                  fontWeight: '700',
                  fontFamily: 'Rubik-Bold',
                }}
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </Pressable>
      </Animated.View>

      {/* Greeting + CTA row — RTL */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          marginTop: 14,
        }}
      >
        {/* Greeting — right in RTL */}
        <View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Rubik-Bold',
              color: COLORS.neutral[800],
              textAlign: 'right',
            }}
          >
            {`שלום, ${userName}`}
          </Text>
          {/* Sync indicator — hidden until offline sync is implemented */}
        </View>

        <View style={{ flex: 1 }} />

        {/* CTA button — left in RTL */}
        <Pressable
          onPress={handleNewInspection}
          style={{
            height: 34,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS.primary[500],
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 5,
            paddingHorizontal: 14,
            ...SHADOWS.sm,
          }}
        >
          <Feather name="plus" size={16} color={COLORS.white} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              fontFamily: 'Rubik-SemiBold',
              color: COLORS.white,
            }}
          >
            בדיקה חדשה
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
