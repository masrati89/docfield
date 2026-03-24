import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { COLORS } from '@docfield/ui';

interface ChecklistProgressProps {
  completed: number;
  total: number;
}

export function ChecklistProgress({
  completed,
  total,
}: ChecklistProgressProps) {
  const progress = useSharedValue(0);
  const percentage = total > 0 ? completed / total : 0;
  const isComplete = completed === total && total > 0;

  useEffect(() => {
    progress.value = withSpring(percentage, {
      damping: 15,
      stiffness: 100,
    });
  }, [percentage, progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.min(progress.value * 100, 100)}%` as `${number}%`,
  }));

  const barColorStyle = useAnimatedStyle(() => ({
    backgroundColor: isComplete
      ? withTiming(COLORS.success[500], { duration: 300 })
      : withTiming(COLORS.primary[500], { duration: 300 }),
  }));

  return (
    <View className="px-[20px] py-[12px]">
      {/* Progress bar */}
      <View className="h-[6px] rounded-full bg-cream-200 overflow-hidden">
        <Animated.View
          className="h-full rounded-full"
          style={[barStyle, barColorStyle]}
        />
      </View>

      {/* Label */}
      <Text
        className="text-[13px] font-rubik mt-[6px]"
        style={{
          color: isComplete ? COLORS.success[500] : COLORS.neutral[500],
        }}
      >
        {isComplete ? 'הושלם!' : `${completed}/${total} פריטים נבדקו`}
      </Text>
    </View>
  );
}
