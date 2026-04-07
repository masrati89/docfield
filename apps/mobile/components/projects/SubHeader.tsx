import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

// --- Types ---

interface SubHeaderProps {
  title: string;
  subtitle?: string;
  onMenu: () => void;
}

// --- Component ---

export function SubHeader({ title, subtitle, onMenu }: SubHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.cream[50],
      }}
    >
      {/* Top row: hamburger (right) — logo (left) in RTL */}
      <Animated.View
        entering={FadeInDown.duration(200)}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
        }}
      >
        {/* Menu button (right in RTL — first in row-reverse) */}
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

        <View style={{ flex: 1 }} />

        {/* Logo (left in RTL) */}
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            backgroundColor: COLORS.primary[50],
            borderWidth: 1,
            borderColor: COLORS.primary[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="clipboard" size={16} color={COLORS.primary[500]} />
        </View>
      </Animated.View>

      {/* Title + subtitle */}
      <Animated.View
        entering={FadeInDown.delay(50).duration(200)}
        style={{ marginTop: 12 }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: COLORS.neutral[800],
            fontFamily: 'Rubik-Bold',
            textAlign: 'right',
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 4,
              marginTop: 2,
            }}
          >
            <Feather name="map-pin" size={12} color={COLORS.neutral[400]} />
            <Text
              style={{
                fontSize: 11,
                color: COLORS.neutral[400],
                fontFamily: 'Rubik-Regular',
              }}
            >
              {subtitle}
            </Text>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}
