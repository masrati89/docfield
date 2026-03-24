import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';
import type { DefectWithPhotos } from '@docfield/shared';
import {
  ROOM_LABELS,
  CATEGORY_LABELS,
  SEVERITY_LABELS,
} from '@docfield/shared';

// Severity indicator colors
const SEVERITY_DOT_COLORS: Record<string, string> = {
  critical: COLORS.danger[500],
  medium: COLORS.warning[500],
  low: COLORS.info[500],
};

interface DefectCardProps {
  defect: DefectWithPhotos;
  onPress: () => void;
}

export function DefectCard({ defect, onPress }: DefectCardProps) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const roomLabel =
    ROOM_LABELS[defect.room as keyof typeof ROOM_LABELS] ?? defect.room;
  const categoryLabel =
    CATEGORY_LABELS[defect.category as keyof typeof CATEGORY_LABELS] ??
    defect.category;
  const severityLabel =
    SEVERITY_LABELS[defect.severity as keyof typeof SEVERITY_LABELS] ??
    defect.severity;
  const photoCount = defect.photos.length;

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-[14px] p-[16px] mb-[8px] flex-row items-center active:scale-[0.98]"
      style={{
        borderWidth: 1,
        borderColor: COLORS.cream[200],
      }}
    >
      {/* Severity dot */}
      <View
        className="w-[10px] h-[10px] rounded-full me-[12px]"
        style={{
          backgroundColor:
            SEVERITY_DOT_COLORS[defect.severity] ?? COLORS.neutral[400],
        }}
      />

      {/* Content */}
      <View className="flex-1">
        <Text
          className="text-[15px] font-rubik-medium text-neutral-700"
          numberOfLines={1}
        >
          {defect.description}
        </Text>
        <View className="flex-row items-center mt-[4px]">
          <Text className="text-[13px] font-rubik text-neutral-500">
            {roomLabel} · {categoryLabel} · {severityLabel}
          </Text>
          {photoCount > 0 && (
            <View className="flex-row items-center ms-[8px]">
              <Feather name="camera" size={12} color={COLORS.neutral[400]} />
              <Text className="text-[13px] font-rubik text-neutral-400 ms-[2px]">
                {photoCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Chevron */}
      <Feather name="chevron-left" size={18} color={COLORS.neutral[300]} />
    </Pressable>
  );
}
