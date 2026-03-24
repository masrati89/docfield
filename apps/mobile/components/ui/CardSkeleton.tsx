import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CardSkeletonProps {
  lines?: number;
  showIcon?: boolean;
}

export function CardSkeleton({
  lines = 2,
  showIcon = true,
}: CardSkeletonProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="bg-white rounded-[14px] border border-cream-200 p-[16px] flex-row items-start"
    >
      {showIcon && (
        <View className="w-[44px] h-[44px] rounded-[10px] bg-cream-200 me-[12px]" />
      )}
      <View className="flex-1">
        <View className="h-[16px] bg-cream-200 rounded w-[60%] mb-[8px]" />
        {lines >= 2 && (
          <View className="h-[12px] bg-cream-200 rounded w-[40%] mb-[8px]" />
        )}
        {lines >= 3 && (
          <View className="h-[12px] bg-cream-200 rounded w-[80%]" />
        )}
      </View>
    </Animated.View>
  );
}

export function GridCardSkeleton() {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="bg-white rounded-[14px] border border-cream-200 p-[16px] items-center flex-1"
    >
      <View className="h-[20px] bg-cream-200 rounded w-[50%] mb-[8px]" />
      <View className="h-[1px] bg-cream-200 w-full my-[8px]" />
      <View className="h-[12px] bg-cream-200 rounded w-[70%] mb-[6px]" />
      <View className="h-[12px] bg-cream-200 rounded w-[50%] mb-[10px]" />
      <View className="h-[22px] bg-cream-200 rounded-full w-[60%]" />
    </Animated.View>
  );
}
