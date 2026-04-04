import { useCallback } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

// --- Types ---

interface InfoSectionProps {
  onComingSoon: () => void;
}

// --- Component ---

export function InfoSection({ onComingSoon }: InfoSectionProps) {
  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onComingSoon();
  }, [onComingSoon]);

  return (
    <Animated.View
      entering={FadeInUp.delay(350).duration(400)}
      className="mx-[20px] mb-[24px]"
    >
      <Text className="text-[18px] font-rubik-semibold text-neutral-800 text-right mb-[16px]">
        מידע
      </Text>

      {/* App version */}
      <View className="flex-row items-center justify-between py-[14px] border-b border-cream-200">
        <View className="flex-row items-center gap-[8px]">
          <Feather name="info" size={20} color={COLORS.neutral[600]} />
          <Text className="text-[15px] font-rubik text-neutral-700">
            גרסת אפליקציה
          </Text>
        </View>
        <Text className="text-[14px] font-rubik text-neutral-400">1.0.0</Text>
      </View>

      {/* Terms of use */}
      <Pressable
        onPress={handlePress}
        className="flex-row items-center justify-between py-[14px] border-b border-cream-200"
      >
        <View className="flex-row items-center gap-[8px]">
          <Feather name="file-text" size={20} color={COLORS.neutral[600]} />
          <Text className="text-[15px] font-rubik text-neutral-700">
            תנאי שימוש
          </Text>
        </View>
        <Feather name="chevron-left" size={20} color={COLORS.neutral[400]} />
      </Pressable>

      {/* Privacy policy */}
      <Pressable
        onPress={handlePress}
        className="flex-row items-center justify-between py-[14px]"
      >
        <View className="flex-row items-center gap-[8px]">
          <Feather name="shield" size={20} color={COLORS.neutral[600]} />
          <Text className="text-[15px] font-rubik text-neutral-700">
            מדיניות פרטיות
          </Text>
        </View>
        <Feather name="chevron-left" size={20} color={COLORS.neutral[400]} />
      </Pressable>
    </Animated.View>
  );
}
