import { useCallback, useState } from 'react';
import { View, Text, Pressable, Modal, Platform } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@infield/ui';
import { useRouter } from 'expo-router';

import type { ReportType } from './NewInspectionSheet.types';

const REPORT_TYPES: {
  key: ReportType;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { key: 'delivery', label: 'פרוטוקול מסירה', icon: 'clipboard' },
  { key: 'bedek_bait', label: 'בדק בית', icon: 'search' },
];

interface NewInspectionSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function NewInspectionSheet({
  visible,
  onClose,
}: NewInspectionSheetProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);

  const handleSelectType = useCallback((type: ReportType) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedType(type);
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedType) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onClose();
    setSelectedType(null);

    // Navigate to projects list to select apartment
    router.push({
      pathname: '/(app)/projects',
      params: { reportType: selectedType },
    });
  }, [selectedType, onClose, router]);

  const handleClose = useCallback(() => {
    setSelectedType(null);
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <Pressable className="flex-1" onPress={handleClose} />

        {/* Sheet */}
        <Animated.View
          entering={SlideInDown.duration(350).springify()}
          exiting={SlideOutDown.duration(250)}
          className="bg-cream-50 rounded-t-[16px] px-[16px] pb-[24px]"
          style={{
            shadowColor: 'rgba(60,54,42,1)',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            elevation: 16,
          }}
        >
          {/* Handle bar */}
          <View className="items-center pt-[8px] pb-[16px]">
            <View className="w-[36px] h-[4px] rounded-full bg-cream-300" />
          </View>

          {/* Header */}
          <View className="flex-row-reverse items-center justify-between mb-[24px]">
            <Text className="text-[20px] font-rubik-bold text-neutral-800">
              בדיקה חדשה
            </Text>
            <Pressable
              onPress={handleClose}
              className="w-[36px] h-[36px] rounded-md items-center justify-center bg-cream-100 border border-cream-200"
              accessibilityLabel="סגור"
            >
              <Feather name="x" size={20} color={COLORS.neutral[600]} />
            </Pressable>
          </View>

          {/* Subtitle */}
          <Text className="text-[14px] font-rubik text-neutral-500 mb-[16px] text-right">
            בחר את סוג הבדיקה
          </Text>

          {/* Type selection pills */}
          <View className="gap-[8px] mb-[24px]">
            {REPORT_TYPES.map((type) => {
              const isSelected = selectedType === type.key;
              return (
                <Pressable
                  key={type.key}
                  onPress={() => handleSelectType(type.key)}
                  className={`h-[56px] rounded-[14px] flex-row-reverse items-center px-[16px] border-[1.5px] ${
                    isSelected
                      ? 'bg-primary-50 border-primary-500'
                      : 'bg-cream-100 border-cream-200'
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  {/* Radio indicator */}
                  <View
                    className={`w-[20px] h-[20px] rounded-full border-[2px] items-center justify-center me-[12px] ${
                      isSelected ? 'border-primary-500' : 'border-neutral-300'
                    }`}
                  >
                    {isSelected && (
                      <View className="w-[10px] h-[10px] rounded-full bg-primary-500" />
                    )}
                  </View>

                  {/* Icon */}
                  <View
                    className={`w-[36px] h-[36px] rounded-md items-center justify-center me-[12px] ${
                      isSelected ? 'bg-primary-100' : 'bg-cream-200'
                    }`}
                  >
                    <Feather
                      name={type.icon}
                      size={20}
                      color={
                        isSelected ? COLORS.primary[500] : COLORS.neutral[500]
                      }
                    />
                  </View>

                  {/* Label */}
                  <Text
                    className={`text-[15px] flex-1 text-right ${
                      isSelected
                        ? 'font-rubik-semibold text-primary-700'
                        : 'font-rubik-medium text-neutral-700'
                    }`}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Continue button */}
          <Pressable
            onPress={handleContinue}
            disabled={!selectedType}
            className={`h-[48px] rounded-[14px] items-center justify-center flex-row-reverse ${
              selectedType
                ? 'bg-primary-500 active:bg-primary-600'
                : 'bg-neutral-200'
            }`}
            accessibilityRole="button"
            accessibilityLabel="המשך"
          >
            <Text
              className={`text-[15px] font-rubik-semibold ${
                selectedType ? 'text-white' : 'text-neutral-400'
              }`}
            >
              המשך
            </Text>
            <Feather
              name="arrow-left"
              size={16}
              color={selectedType ? COLORS.white : COLORS.neutral[400]}
              style={{ marginEnd: 8 }}
            />
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
