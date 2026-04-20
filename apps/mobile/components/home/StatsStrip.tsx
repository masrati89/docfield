import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { SkeletonBlock } from '@/components/ui';

// --- Types ---

interface StatsStripProps {
  draftsCount: number;
  completedThisMonth: number;
  isLoading: boolean;
}

// --- Component ---

export function StatsStrip({
  draftsCount,
  completedThisMonth,
  isLoading,
}: StatsStripProps) {
  const items = [
    {
      value: draftsCount,
      label: 'טיוטות',
      valueColor: COLORS.gold[700],
      bg: COLORS.gold[100],
    },
    {
      value: completedThisMonth,
      label: 'הושלמו החודש',
      valueColor: COLORS.primary[700],
      bg: COLORS.primary[50],
    },
  ];

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(400)}
      style={{
        flexDirection: 'row-reverse',
        gap: 8,
        marginTop: 10,
      }}
    >
      {items.map((item, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 10,
            padding: 10,
            paddingHorizontal: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            backgroundColor: '#fff',
          }}
        >
          {isLoading ? (
            <SkeletonBlock width={34} height={34} borderRadius={8} />
          ) : (
            <View
              style={{
                minWidth: 34,
                height: 34,
                paddingHorizontal: 8,
                borderRadius: 8,
                backgroundColor: item.bg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: item.valueColor,
                  fontFamily: 'Inter-Bold',
                }}
              >
                {item.value}
              </Text>
            </View>
          )}
          <Text
            style={{
              fontSize: 11,
              fontWeight: '500',
              color: COLORS.neutral[600],
              fontFamily: 'Rubik-Medium',
              lineHeight: 14,
              textAlign: 'right',
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </Animated.View>
  );
}
