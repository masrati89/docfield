import { View, Text, I18nManager } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import {
  AnimatedPressable,
  formatRelativeTime,
  haptic,
} from './projectsConstants';
import type { ProjectItem } from '@/hooks/useProjects';

export function ProjectCard({
  item,
  onPress: onCardPress,
}: {
  item: ProjectItem;
  onPress: () => void;
}) {
  const pct =
    item.totalApts > 0
      ? Math.round((item.completedApts / item.totalApts) * 100)
      : 0;
  const isComplete = item.status === 'completed';
  const navHint =
    item.buildingsCount === 1
      ? `${item.totalApts} דירות`
      : `${item.buildingsCount} בניינים · ${item.totalApts} דירות`;

  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      }}
      onPress={() => {
        haptic();
        onCardPress();
      }}
      style={[
        {
          backgroundColor: COLORS.cream[50],
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          borderRadius: 14,
          overflow: 'hidden',
          flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
          shadowColor: '#3C362A',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 3,
          elevation: 1,
        },
        animStyle,
      ]}
    >
      {/* Status accent bar */}
      <View
        style={{
          width: 4,
          backgroundColor: isComplete ? COLORS.primary[500] : COLORS.gold[500],
          borderTopRightRadius: 14,
          borderBottomRightRadius: 14,
        }}
      />

      <View style={{ flex: 1, padding: 14, paddingStart: 16 }}>
        {/* Row 1: Name + completed badge + chevron */}
        <View
          style={{
            flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
            alignItems: 'flex-start',
            marginBottom: 4,
          }}
        >
          {isComplete && (
            <View
              style={{
                backgroundColor: COLORS.primary[50],
                borderRadius: 5,
                paddingHorizontal: 6,
                paddingVertical: 2,
                marginEnd: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Rubik-SemiBold',
                  color: COLORS.primary[700],
                }}
              >
                הושלם ✓
              </Text>
            </View>
          )}
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              fontFamily: 'Rubik-Bold',
              color: COLORS.neutral[800],
              textAlign: 'right',
              writingDirection: 'rtl',
            }}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Feather name="chevron-left" size={16} color={COLORS.neutral[300]} />
        </View>

        {/* Row 2: Address */}
        <View
          style={{
            flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
            alignItems: 'center',
            gap: 4,
            marginBottom: 10,
          }}
        >
          <Feather name="map-pin" size={16} color={COLORS.neutral[400]} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
            }}
            numberOfLines={1}
          >
            {item.address}
          </Text>
        </View>

        {/* Row 3: Progress bar */}
        <View
          style={{
            flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
            }}
          >
            דירות
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isComplete ? COLORS.primary[500] : COLORS.neutral[600],
            }}
          >
            {item.completedApts}/{item.totalApts}
          </Text>
          {/* Progress bar — always LTR fill direction */}
          <View
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: COLORS.cream[200],
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${pct}%` as unknown as number,
                height: '100%',
                borderRadius: 3,
                backgroundColor: isComplete
                  ? COLORS.primary[500]
                  : COLORS.gold[500],
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Inter',
              fontWeight: '700',
              color: isComplete ? COLORS.primary[500] : COLORS.neutral[700],
            }}
          >
            {pct}%
          </Text>
        </View>

        {/* Row 4: Stats */}
        <View
          style={{
            flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
            alignItems: 'center',
          }}
        >
          {/* Buildings + defects */}
          <View
            style={{
              flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <View
              style={{
                flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Feather
                name={item.buildingsCount > 1 ? 'grid' : 'home'}
                size={16}
                color={COLORS.neutral[400]}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[500],
                }}
              >
                {navHint}
              </Text>
            </View>
            {item.openDefects > 0 && (
              <View
                style={{
                  flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
                  alignItems: 'center',
                  gap: 3,
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
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: COLORS.gold[700],
                  }}
                >
                  {item.openDefects}
                </Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1 }} />

          {/* Activity */}
          <View
            style={{
              flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[400],
              }}
            >
              {formatRelativeTime(item.updatedAt)}
            </Text>
            <Feather name="calendar" size={16} color={COLORS.neutral[400]} />
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}
