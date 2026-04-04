import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';

// --- Types ---

interface HomeHeaderProps {
  userName: string;
  onNewInspection?: () => void;
  onBell?: () => void;
  onMenu?: () => void;
}

// --- Component ---

export function HomeHeader({
  userName,
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
          <Feather name="bell" size={20} color={COLORS.neutral[500]} />
          {/* Notification dot */}
          <View
            style={{
              position: 'absolute',
              top: 6,
              right: 7,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: COLORS.danger[500],
              borderWidth: 1.5,
              borderColor: COLORS.cream[50],
            }}
          />
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
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 4,
              marginTop: 1,
            }}
          >
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: COLORS.success[500],
              }}
            />
            <Text
              style={{
                fontSize: 10,
                color: COLORS.neutral[400],
                fontFamily: 'Rubik-Regular',
              }}
            >
              מסונכרן
            </Text>
          </View>
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
          <Feather name="plus" size={16} color="white" />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              fontFamily: 'Rubik-SemiBold',
              color: 'white',
            }}
          >
            בדיקה חדשה
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
