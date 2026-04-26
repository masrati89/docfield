import { useCallback } from 'react';
import {
  Pressable,
  TouchableOpacity,
  Platform,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from '@/lib/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = { damping: 15, stiffness: 150 };

interface PressableScaleProps {
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  scale?: number;
  haptic?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'menuitem' | 'link';
  hitSlop?: number;
  testID?: string;
}

export function PressableScale({
  onPress,
  onLongPress,
  disabled = false,
  scale: scaleTarget = 0.97,
  haptic: enableHaptic = true,
  style,
  children,
  accessibilityLabel,
  accessibilityRole = 'button',
  hitSlop,
  testID,
}: PressableScaleProps) {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handlePressIn = useCallback(() => {
    scaleValue.value = withSpring(scaleTarget, SPRING_CONFIG);
  }, [scaleValue, scaleTarget]);

  const handlePressOut = useCallback(() => {
    scaleValue.value = withSpring(1, SPRING_CONFIG);
  }, [scaleValue]);

  const handlePress = useCallback(() => {
    console.warn(
      `[PressableScale] ${testID || 'unnamed'} pressed (Platform: ${Platform.OS})`
    );
    if (typeof window !== 'undefined' && __DEV__) {
      console.warn('[PressableScale Web Debug]', {
        testID,
        disabled,
        onPressExists: !!onPress,
        timestamp: new Date().toISOString(),
      });
    }
    if (enableHaptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  }, [enableHaptic, onPress, testID, disabled]);

  // On Web, use TouchableOpacity which works better than Pressable
  if (Platform.OS === 'web') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={[style, disabled ? { opacity: 0.5 } : undefined]}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Native: use animated version
  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      hitSlop={hitSlop}
      style={[animatedStyle, style, disabled ? { opacity: 0.5 } : undefined]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      testID={testID}
    >
      {children}
    </AnimatedPressable>
  );
}
