import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS, SHADOWS } from '@infield/ui';
import { SkeletonBlock } from '@/components/ui';

interface ProgressCardProps {
  doneUnits: number;
  totalUnits: number;
  isLoading: boolean;
}

export function ProgressCard({
  doneUnits,
  totalUnits,
  isLoading,
}: ProgressCardProps) {
  const pct = totalUnits > 0 ? Math.round((doneUnits / totalUnits) * 100) : 0;

  return (
    <Animated.View entering={FadeInDown.delay(250).duration(400)}>
      <View
        style={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          borderRadius: 14,
          padding: 14,
          ...SHADOWS.sm,
        }}
      >
        {/* Title row */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: COLORS.neutral[800],
                fontFamily: 'Rubik-Bold',
                textAlign: 'right',
                letterSpacing: -0.15,
              }}
            >
              התקדמות כללית
            </Text>
            {isLoading ? (
              <SkeletonBlock
                width={100}
                height={12}
                borderRadius={4}
                style={{ marginTop: 2 }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 11,
                  color: COLORS.neutral[500],
                  fontFamily: 'Rubik-Regular',
                  textAlign: 'right',
                  marginTop: 2,
                }}
              >
                <Text
                  style={{
                    color: COLORS.neutral[700],
                    fontFamily: 'Inter-SemiBold',
                    fontWeight: '600',
                  }}
                >
                  {doneUnits}
                </Text>
                {' מתוך '}
                <Text
                  style={{
                    color: COLORS.neutral[700],
                    fontFamily: 'Inter-SemiBold',
                    fontWeight: '600',
                  }}
                >
                  {totalUnits}
                </Text>
                {' יחידות'}
              </Text>
            )}
          </View>

          {/* Percentage */}
          {isLoading ? (
            <SkeletonBlock width={50} height={26} borderRadius={6} />
          ) : (
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: COLORS.primary[700],
                fontFamily: 'Inter-Bold',
                lineHeight: 26,
              }}
            >
              {pct}%
            </Text>
          )}
        </View>

        {/* Progress bar */}
        <View
          style={{
            height: 8,
            backgroundColor: COLORS.cream[200],
            borderRadius: 4,
            overflow: 'hidden',
            direction: 'ltr',
          }}
        >
          <View
            style={{
              width: `${pct}%`,
              height: '100%',
              borderRadius: 4,
              backgroundColor: COLORS.primary[500],
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
}
