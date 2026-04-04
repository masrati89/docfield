import { useEffect } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';
import { DefectRow } from '@/components/reports/DefectRow';
import type { CategoryGroup } from '@/components/reports/reportDetailConstants';

interface CategoryAccordionProps {
  group: CategoryGroup;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  onAddDefect: (category: string) => void;
  onDeleteDefect: (defectId: string) => void;
}

export function CategoryAccordion({
  group,
  isOpen,
  onToggle,
  index,
  onAddDefect,
  onDeleteDefect,
}: CategoryAccordionProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, { duration: 200 });
  }, [isOpen, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(300)}
      style={{
        marginBottom: 8,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        backgroundColor: COLORS.cream[50],
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        ...SHADOWS.sm,
      }}
    >
      {/* Category header */}
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onToggle();
        }}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 8,
          padding: 12,
        }}
      >
        {/* Grip handle */}
        <View style={{ width: 10, alignItems: 'center' }}>
          {[0, 5, 10].map((y) => (
            <View
              key={y}
              style={{
                flexDirection: 'row',
                gap: 4,
                marginBottom: y < 10 ? 3 : 0,
              }}
            >
              <View
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: COLORS.neutral[300],
                }}
              />
              <View
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: COLORS.neutral[300],
                }}
              />
            </View>
          ))}
        </View>

        {/* Name + count */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: COLORS.neutral[800],
              fontFamily: 'Rubik-SemiBold',
              textAlign: 'right',
            }}
          >
            {group.name}
          </Text>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: COLORS.neutral[500],
                fontFamily: 'Rubik-Regular',
              }}
            >
              {group.defects.length} ממצאים
            </Text>
            {group.photoCount > 0 && (
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Feather name="camera" size={16} color={COLORS.neutral[400]} />
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.neutral[400],
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  {group.photoCount}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Add button */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            onAddDefect(group.name);
          }}
          style={{
            width: 36,
            height: 36,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.primary[100],
            backgroundColor: COLORS.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="plus" size={16} color={COLORS.primary[500]} />
        </Pressable>

        <View style={{ width: 8 }} />

        {/* Chevron */}
        <Animated.View style={chevronStyle}>
          <Feather name="chevron-down" size={16} color={COLORS.neutral[400]} />
        </Animated.View>
      </Pressable>

      {/* Defect rows (only when open) */}
      {isOpen && group.defects.length > 0 && (
        <View style={{ borderTopWidth: 1, borderTopColor: COLORS.cream[200] }}>
          {group.defects.map((defect, di) => (
            <DefectRow
              key={defect.id}
              defect={defect}
              isLast={di === group.defects.length - 1}
              onDelete={onDeleteDefect}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
}
