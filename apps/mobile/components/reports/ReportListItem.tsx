import { View, Text, Platform, I18nManager } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import type { ReportItem } from '@/hooks/useReports';

import {
  STATUS_CONFIG,
  TYPE_LABELS,
  formatRelativeTime,
  haptic,
  AnimatedPressable,
} from './reportsConstants';

export function ReportRow({
  item,
  isLast,
  index = 0,
  onPress,
  onDelete,
}: {
  item: ReportItem;
  isLast: boolean;
  index?: number;
  onPress?: () => void;
  onDelete?: (id: string) => void;
}) {
  const st = STATUS_CONFIG[item.status];
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(60 * index).duration(200)}>
      <AnimatedPressable
        onPressIn={() => {
          scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 150 });
        }}
        onPress={() => {
          haptic();
          onPress?.();
        }}
        onLongPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          onDelete?.(item.id);
        }}
        style={[
          {
            flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: COLORS.cream[200],
          },
          animStyle,
        ]}
      >
        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-SemiBold',
              color: COLORS.neutral[800],
              textAlign: 'right',
              writingDirection: 'rtl',
              marginBottom: 2,
            }}
            numberOfLines={1}
          >
            {item.project}
          </Text>
          <View
            style={{
              flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[500],
              }}
              numberOfLines={1}
            >
              {item.apartment}
            </Text>
            <Text style={{ fontSize: 10, color: COLORS.neutral[300] }}>·</Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[400],
              }}
            >
              {TYPE_LABELS[item.reportType]}
            </Text>
            <Text style={{ fontSize: 10, color: COLORS.neutral[300] }}>·</Text>
            <View
              style={{
                flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Feather name="clock" size={10} color={COLORS.neutral[400]} />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[400],
                }}
              >
                {formatRelativeTime(item.updatedAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Status badge + defect count */}
        <View style={{ alignItems: 'center', gap: 3, marginStart: 8 }}>
          <View
            style={{
              backgroundColor: st.bg,
              borderRadius: 5,
              paddingHorizontal: 7,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Rubik-SemiBold',
                color: st.color,
              }}
            >
              {st.label}
            </Text>
          </View>
          <View
            style={{
              flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Feather name="alert-triangle" size={10} color={COLORS.gold[500]} />
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Inter-Regular',
                fontWeight: '500',
                color: COLORS.neutral[500],
              }}
            >
              {item.defectCount}
            </Text>
          </View>
        </View>

        {/* Chevron */}
        <Feather name="chevron-left" size={14} color={COLORS.neutral[300]} />
      </AnimatedPressable>
    </Animated.View>
  );
}

export function GroupHeader({ name, count }: { name: string; count: number }) {
  return (
    <View
      style={{
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 4,
      }}
    >
      <View
        style={{
          width: 4,
          height: 14,
          borderRadius: 2,
          backgroundColor: COLORS.primary[500],
        }}
      />
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Rubik-Bold',
          color: COLORS.primary[700],
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: 'Inter-Regular',
          fontWeight: '500',
          color: COLORS.neutral[400],
        }}
      >
        {count}
      </Text>
    </View>
  );
}
