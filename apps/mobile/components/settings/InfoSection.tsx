import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

// --- Component ---

export function InfoSection() {
  return (
    <Animated.View
      entering={FadeInUp.delay(350).duration(400)}
      className="mx-[20px] mb-[24px]"
    >
      <Text className="text-[18px] font-rubik-semibold text-neutral-800 text-right mb-[16px]">
        מידע
      </Text>

      {/* App version */}
      <View className="flex-row items-center justify-between py-[14px]">
        <View className="flex-row items-center gap-[8px]">
          <Feather name="info" size={20} color={COLORS.neutral[600]} />
          <Text className="text-[15px] font-rubik text-neutral-700">
            גרסת אפליקציה
          </Text>
        </View>
        <Text className="text-[14px] font-rubik text-neutral-400">1.0.0</Text>
      </View>
    </Animated.View>
  );
}
