import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

// --- Types ---

interface ProgressStripProps {
  completed: number;
  total: number;
  label: string;
}

// --- Component ---

export function ProgressStrip({ completed, total, label }: ProgressStripProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isFull = pct === 100;

  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(pct, {
      duration: 600,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
  }, [pct, progressWidth]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(50).duration(200)}
      style={{
        marginHorizontal: 16,
        marginTop: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: COLORS.cream[50],
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.cream[200],
      }}
    >
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: COLORS.neutral[500],
            fontFamily: 'Rubik-Regular',
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: isFull ? COLORS.primary[500] : COLORS.neutral[700],
            fontFamily: 'Rubik-Bold',
          }}
        >
          {completed}/{total}
        </Text>
        <View
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor: COLORS.cream[200],
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={[
              {
                height: '100%',
                borderRadius: 3,
                backgroundColor: isFull
                  ? COLORS.primary[500]
                  : COLORS.gold[500],
              },
              animatedProgressStyle,
            ]}
          />
        </View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: isFull ? COLORS.primary[500] : COLORS.gold[500],
            fontFamily: 'Rubik-Bold',
          }}
        >
          {pct}%
        </Text>
      </View>
    </Animated.View>
  );
}
