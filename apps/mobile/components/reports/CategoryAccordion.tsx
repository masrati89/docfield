import { useEffect } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInDown,
  FadeOutUp,
} from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { DefectRow } from '@/components/reports/DefectRow';
import type { CategoryGroup } from '@/components/reports/reportDetailConstants';
import type { ReviewStatus } from '@/hooks/useReport';

interface CategoryAccordionProps {
  group: CategoryGroup;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  onAddDefect: (category: string) => void;
  onDeleteDefect: (defectId: string) => void;
  onReviewStatusChange?: (defectId: string, next: ReviewStatus) => void;
  isReviewUpdating?: boolean;
}

export function CategoryAccordion({
  group,
  isOpen,
  onToggle,
  index,
  onAddDefect,
  onDeleteDefect,
  onReviewStatusChange,
  isReviewUpdating,
}: CategoryAccordionProps) {
  const rotation = useSharedValue(0);
  const count = group.defects.length;
  const empty = count === 0;
  const costSum = group.defects.reduce((a, d) => a + (d.cost ?? 0), 0);

  useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, { duration: 150 });
  }, [isOpen, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(300)}
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: empty ? COLORS.cream[50] : '#fff',
        borderWidth: 1,
        borderColor: empty ? COLORS.cream[200] : COLORS.primary[200],
        ...(empty ? {} : { boxShadow: '0 1px 3px rgba(60,54,42,.06)' }),
      }}
    >
      {/* Category header */}
      <Pressable
        onPress={() => {
          if (count > 0) {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onToggle();
          }
        }}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 10,
          paddingVertical: 12,
          paddingHorizontal: 14,
          backgroundColor: empty
            ? 'transparent'
            : isOpen
              ? COLORS.primary[50]
              : 'transparent',
          borderBottomWidth: isOpen ? 1 : 0,
          borderBottomColor: COLORS.primary[200],
        }}
      >
        {/* Color accent bar */}
        <View
          style={{
            width: 6,
            height: 24,
            borderRadius: 3,
            backgroundColor: empty ? COLORS.neutral[300] : COLORS.primary[500],
          }}
        />

        {/* Name + sub-info */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: empty ? COLORS.neutral[500] : COLORS.neutral[800],
              fontFamily: 'Rubik-Bold',
              textAlign: 'right',
              letterSpacing: -0.1,
            }}
          >
            {group.name}
          </Text>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 6,
              marginTop: 2,
            }}
          >
            {count > 0 ? (
              <>
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.neutral[500],
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  {count} ממצאים
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.neutral[300],
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  ·
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.gold[700],
                    fontFamily: 'Inter-SemiBold',
                    fontWeight: '600',
                    writingDirection: 'ltr',
                  }}
                >
                  ₪{costSum.toLocaleString()}
                </Text>
              </>
            ) : (
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.neutral[500],
                  fontFamily: 'Rubik-Regular',
                }}
              >
                אין ממצאים
              </Text>
            )}
          </View>
        </View>

        {/* Chevron — only when has findings */}
        {count > 0 && (
          <Animated.View style={chevronStyle}>
            <Feather
              name="chevron-down"
              size={16}
              color={COLORS.neutral[500]}
            />
          </Animated.View>
        )}

        {/* Add button — solid green */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onAddDefect(group.name);
          }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: COLORS.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(27,122,68,.25)',
          }}
        >
          <Feather name="plus" size={18} color="#fff" />
        </Pressable>
      </Pressable>

      {/* Defect rows (only when open) */}
      {isOpen && count > 0 && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(200)}
          style={{
            padding: 8,
            paddingHorizontal: 10,
            paddingBottom: 10,
            gap: 6,
          }}
        >
          {group.defects.map((defect, di) => (
            <DefectRow
              key={defect.id}
              defect={defect}
              isLast={di === group.defects.length - 1}
              onDelete={onDeleteDefect}
              onReviewStatusChange={onReviewStatusChange}
              isReviewUpdating={isReviewUpdating}
            />
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
}
