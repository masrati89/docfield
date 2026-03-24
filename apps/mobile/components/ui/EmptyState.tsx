import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

interface EmptyStateProps {
  icon: FeatherIconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const handleAction = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onAction?.();
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(400)}
      className="flex-1 items-center justify-center px-[32px]"
    >
      <View className="w-[80px] h-[80px] rounded-full bg-cream-100 items-center justify-center mb-[16px]">
        <Feather name={icon} size={32} color={COLORS.neutral[300]} />
      </View>
      <Text className="text-[17px] font-rubik-semibold text-neutral-700 mb-[8px] text-center">
        {title}
      </Text>
      <Text className="text-[15px] font-rubik text-neutral-500 text-center">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Pressable
          onPress={handleAction}
          className="mt-[20px] h-[48px] px-[24px] rounded-[14px] items-center justify-center border border-cream-300 bg-cream-100 active:bg-cream-200"
        >
          <Text className="text-[15px] font-rubik-medium text-primary-700">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
