import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { SkeletonBlock } from '@/components/ui';

// --- Animated Counter ---

function AnimatedCounter({ value, color }: { value: number; color: string }) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = 0;
    animatedValue.value = withTiming(value, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, animatedValue]);

  // Since we can't easily interpolate text in Reanimated,
  // use a simple approach with state
  return (
    <Text
      style={{
        fontSize: 22,
        fontWeight: '700',
        fontFamily: 'Rubik-Bold',
        color,
        lineHeight: 26,
        includeFontPadding: false,
        textAlignVertical: 'center',
      }}
    >
      {value}
    </Text>
  );
}

// --- Types ---

interface StatsStripProps {
  draftsCount: number;
  completedCount: number;
  isLoading: boolean;
}

// --- Component ---

export function StatsStrip({
  draftsCount,
  completedCount,
  isLoading,
}: StatsStripProps) {
  const items = [
    { value: draftsCount, label: 'טיוטות', color: COLORS.gold[500] },
    { value: completedCount, label: 'הושלמו', color: COLORS.primary[500] },
  ];

  return (
    <Animated.View
      entering={FadeInDown.delay(150).duration(400)}
      style={{
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 12,
        gap: 8,
      }}
    >
      {items.map((item, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingTop: 12,
            paddingBottom: 10,
            paddingHorizontal: 4,
            borderRadius: BORDER_RADIUS.lg,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            backgroundColor: COLORS.cream[50],
          }}
        >
          {isLoading ? (
            <SkeletonBlock width={40} height={22} borderRadius={6} />
          ) : (
            <AnimatedCounter value={item.value} color={item.color} />
          )}
          <Text
            style={{
              fontSize: 10,
              fontWeight: '500',
              color: COLORS.neutral[400],
              fontFamily: 'Rubik-Medium',
              marginTop: 2,
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </Animated.View>
  );
}
