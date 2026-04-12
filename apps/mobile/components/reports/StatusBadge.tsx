import { useCallback, useState } from 'react';
import { View, Text, Pressable, Modal, Platform } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, BORDER_RADIUS } from '@infield/ui';

type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

interface StatusBadgeProps {
  status: ReportStatus;
  isUpdating: boolean;
  onStatusChange: (newStatus: ReportStatus) => void;
}

const STATUS_OPTIONS: {
  key: ReportStatus;
  label: string;
  color: string;
  bg: string;
}[] = [
  {
    key: 'draft',
    label: 'טיוטה',
    color: COLORS.neutral[500],
    bg: COLORS.neutral[100],
  },
  {
    key: 'in_progress',
    label: 'בביצוע',
    color: COLORS.warning[700],
    bg: COLORS.warning[50],
  },
  {
    key: 'completed',
    label: 'הושלם',
    color: COLORS.success[700],
    bg: COLORS.success[50],
  },
  {
    key: 'sent',
    label: 'נשלח',
    color: COLORS.primary[600],
    bg: COLORS.primary[50],
  },
];

export function StatusBadge({
  status,
  isUpdating,
  onStatusChange,
}: StatusBadgeProps) {
  const [showPicker, setShowPicker] = useState(false);

  const currentOption =
    STATUS_OPTIONS.find((o) => o.key === status) ?? STATUS_OPTIONS[0];

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowPicker(true);
  }, []);

  const handleSelect = useCallback(
    (newStatus: ReportStatus) => {
      setShowPicker(false);
      if (newStatus !== status) {
        onStatusChange(newStatus);
      }
    },
    [status, onStatusChange]
  );

  const handleClose = useCallback(() => {
    setShowPicker(false);
  }, []);

  return (
    <>
      {/* Badge chip */}
      <Pressable
        onPress={handlePress}
        disabled={isUpdating}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: BORDER_RADIUS.full,
          backgroundColor: currentOption.bg,
          opacity: isUpdating ? 0.5 : 1,
        }}
      >
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: currentOption.color,
          }}
        />
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'Rubik-Medium',
            color: currentOption.color,
          }}
        >
          {currentOption.label}
        </Text>
        <Feather name="chevron-down" size={12} color={currentOption.color} />
      </Pressable>

      {/* Picker modal */}
      <Modal
        visible={showPicker}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
        {/* Backdrop */}
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(60,54,42,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={handleClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          {/* Picker content */}
          <Animated.View
            entering={SlideInUp.duration(300).springify()}
            exiting={SlideOutUp.duration(220)}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: COLORS.cream[50],
                borderRadius: 12,
                padding: 8,
                minWidth: 180,
                shadowColor: COLORS.neutral[900],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {STATUS_OPTIONS.map((option) => {
                const isSelected = option.key === status;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => handleSelect(option.key)}
                    style={{
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: BORDER_RADIUS.md,
                      backgroundColor: isSelected
                        ? COLORS.cream[100]
                        : 'transparent',
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: option.color,
                        marginLeft: 8,
                      }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontFamily: 'Rubik-Regular',
                        color: COLORS.neutral[700],
                        textAlign: 'right',
                      }}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Feather
                        name="check"
                        size={16}
                        color={COLORS.primary[500]}
                        style={{ marginRight: 8 }}
                      />
                    )}
                  </Pressable>
                );
              })}
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}
