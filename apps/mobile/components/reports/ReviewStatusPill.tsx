import { useCallback, useState } from 'react';
import { View, Text, Pressable, Modal, Platform } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import type { ReviewStatus } from '@/hooks/useReport';

// --- Option config ---

interface OptionConfig {
  key: ReviewStatus;
  label: string;
  color: string;
  bg: string;
  icon: keyof typeof Feather.glyphMap;
}

const OPTIONS: OptionConfig[] = [
  {
    key: 'pending_review',
    label: 'ממתין לבדיקה',
    color: COLORS.warning[700],
    bg: COLORS.warning[50],
    icon: 'clock',
  },
  {
    key: 'fixed',
    label: 'תוקן',
    color: COLORS.success[700],
    bg: COLORS.success[50],
    icon: 'check-circle',
  },
  {
    key: 'partially_fixed',
    label: 'תוקן חלקית',
    color: COLORS.gold[600],
    bg: COLORS.gold[100],
    icon: 'alert-circle',
  },
  {
    key: 'not_fixed',
    label: 'לא תוקן',
    color: COLORS.danger[700],
    bg: COLORS.danger[50],
    icon: 'x-circle',
  },
];

// --- Props ---

interface ReviewStatusPillProps {
  status: ReviewStatus;
  isUpdating: boolean;
  onChange: (next: ReviewStatus) => void;
}

// --- Component ---

export function ReviewStatusPill({
  status,
  isUpdating,
  onChange,
}: ReviewStatusPillProps) {
  const [showPicker, setShowPicker] = useState(false);

  const current = OPTIONS.find((o) => o.key === status) ?? OPTIONS[0];

  const handleOpen = useCallback(() => {
    if (isUpdating) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowPicker(true);
  }, [isUpdating]);

  const handleSelect = useCallback(
    (next: ReviewStatus) => {
      setShowPicker(false);
      if (next !== status) {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onChange(next);
      }
    },
    [status, onChange]
  );

  return (
    <>
      {/* Pill trigger */}
      <Pressable
        onPress={handleOpen}
        disabled={isUpdating}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: BORDER_RADIUS.full,
          backgroundColor: current.bg,
          borderWidth: 1,
          borderColor: current.color,
          opacity: isUpdating ? 0.5 : 1,
        }}
        accessibilityRole="button"
        accessibilityLabel={`סטטוס בדיקה: ${current.label}`}
      >
        <Feather name={current.icon} size={10} color={current.color} />
        <Text
          style={{
            fontSize: 10,
            fontFamily: 'Rubik-SemiBold',
            color: current.color,
          }}
        >
          {current.label}
        </Text>
        <Feather name="chevron-down" size={10} color={current.color} />
      </Pressable>

      {/* Picker modal */}
      <Modal
        visible={showPicker}
        transparent
        animationType="none"
        onRequestClose={() => setShowPicker(false)}
      >
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(180)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(60,54,42,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <Pressable
            onPress={() => setShowPicker(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <Animated.View
            entering={SlideInUp.duration(260).springify()}
            exiting={SlideOutUp.duration(200)}
            style={{
              backgroundColor: COLORS.cream[50],
              borderRadius: 14,
              padding: 12,
              minWidth: 220,
              shadowColor: 'rgb(60,54,42)',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[700],
                textAlign: 'right',
                paddingHorizontal: 10,
                paddingVertical: 6,
              }}
            >
              עדכן סטטוס
            </Text>
            {OPTIONS.map((opt) => {
              const isSelected = opt.key === status;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => handleSelect(opt.key)}
                  style={({ pressed }) => ({
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    gap: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: BORDER_RADIUS.md,
                    backgroundColor:
                      pressed || isSelected ? COLORS.cream[100] : 'transparent',
                  })}
                >
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: opt.bg,
                    }}
                  >
                    <Feather name={opt.icon} size={14} color={opt.color} />
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontFamily: isSelected
                        ? 'Rubik-SemiBold'
                        : 'Rubik-Regular',
                      color: COLORS.neutral[700],
                      textAlign: 'right',
                    }}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Feather
                      name="check"
                      size={16}
                      color={COLORS.primary[500]}
                    />
                  )}
                </Pressable>
              );
            })}
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}
