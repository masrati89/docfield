import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

// --- Types ---

export interface BuildingItem {
  id: string;
  name: string;
  floorsCount: number | null;
  totalApts: number;
  completedApts: number;
  openDefects: number;
}

interface BuildingCardProps {
  building: BuildingItem;
  index: number;
  onPress: () => void;
}

// --- Component ---

export const BuildingCard = React.memo(function BuildingCard({
  building,
  index,
  onPress,
}: BuildingCardProps) {
  const pct =
    building.totalApts > 0
      ? Math.round((building.completedApts / building.totalApts) * 100)
      : 0;
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
    <Animated.View entering={FadeInUp.delay(60 * index).duration(200)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: 'row-reverse',
          backgroundColor: COLORS.cream[50],
          borderWidth: 1,
          borderColor: pressed ? COLORS.primary[200] : COLORS.cream[200],
          borderRadius: BORDER_RADIUS.lg,
          overflow: 'hidden',
        })}
      >
        {/* Accent bar */}
        <View
          style={{
            width: 4,
            backgroundColor: isFull ? COLORS.primary[500] : COLORS.gold[500],
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
          }}
        />

        <View style={{ flex: 1, padding: 14, paddingStart: 16 }}>
          {/* Row 1: Icon + Name + defects + chevron */}
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: isFull ? COLORS.primary[50] : COLORS.gold[100],
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
              }}
            >
              <Feather
                name="grid"
                size={20}
                color={isFull ? COLORS.primary[500] : COLORS.gold[500]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: COLORS.neutral[800],
                  fontFamily: 'Rubik-Bold',
                  textAlign: 'right',
                }}
              >
                {building.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 1,
                }}
              >
                {building.floorsCount ? (
                  <>
                    <Text
                      style={{
                        fontSize: 10,
                        color: COLORS.neutral[400],
                        fontFamily: 'Rubik-Regular',
                      }}
                    >
                      {building.floorsCount} קומות
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: COLORS.neutral[300],
                        includeFontPadding: false,
                      }}
                    >
                      ·
                    </Text>
                  </>
                ) : null}
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.neutral[400],
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  {building.totalApts} דירות
                </Text>
              </View>
            </View>

            {building.openDefects > 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 3,
                  marginLeft: 8,
                }}
              >
                <Feather
                  name="alert-triangle"
                  size={16}
                  color={COLORS.gold[500]}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: COLORS.gold[700],
                    fontFamily: 'Rubik-SemiBold',
                  }}
                >
                  {building.openDefects}
                </Text>
              </View>
            ) : null}

            <Feather
              name="chevron-left"
              size={16}
              color={COLORS.neutral[300]}
            />
          </View>

          {/* Row 2: Progress bar */}
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: isFull ? COLORS.primary[500] : COLORS.neutral[600],
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              {building.completedApts}/{building.totalApts}
            </Text>
            <View
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: COLORS.cream[200],
                overflow: 'hidden',
              }}
            >
              <Animated.View
                style={[
                  {
                    height: '100%',
                    borderRadius: 2,
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
                fontSize: 10,
                fontWeight: '600',
                color: isFull ? COLORS.primary[500] : COLORS.gold[500],
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              {pct}%
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});
