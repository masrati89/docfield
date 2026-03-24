import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'משהו השתבש. נסה שוב.',
  onRetry,
}: ErrorStateProps) {
  const handleRetry = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onRetry?.();
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(400)}
      className="flex-1 items-center justify-center px-[32px]"
    >
      <View className="w-[80px] h-[80px] rounded-full bg-danger-50 items-center justify-center mb-[16px]">
        <Feather name="alert-circle" size={32} color={COLORS.danger[500]} />
      </View>
      <Text className="text-[17px] font-rubik-semibold text-neutral-700 mb-[8px] text-center">
        שגיאה
      </Text>
      <Text className="text-[15px] font-rubik text-neutral-500 text-center">
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={handleRetry}
          className="mt-[20px] h-[48px] px-[24px] rounded-[14px] items-center justify-center border border-cream-300 bg-cream-100 active:bg-cream-200"
        >
          <Text className="text-[15px] font-rubik-medium text-primary-700">
            נסה שוב
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
