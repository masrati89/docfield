import { useCallback } from 'react';
import {
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';

// --- Types ---

type ButtonVariant = 'primary' | 'secondary' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

// --- Constants ---

const VARIANT_STYLES: Record<
  ButtonVariant,
  { bg: string; text: string; border?: string }
> = {
  primary: {
    bg: COLORS.primary[500],
    text: COLORS.white,
  },
  secondary: {
    bg: COLORS.cream[100],
    text: COLORS.neutral[700],
    border: COLORS.cream[200],
  },
  destructive: {
    bg: COLORS.danger[700],
    text: COLORS.white,
  },
};

const SIZE_HEIGHTS: Record<ButtonSize, number> = {
  sm: 36,
  md: 46,
  lg: 52,
};

const SIZE_TEXT: Record<ButtonSize, number> = {
  sm: 13,
  md: 15,
  lg: 15,
};

const SIZE_RADIUS: Record<ButtonSize, number> = {
  sm: 10,
  md: 12,
  lg: 14,
};

// --- Component ---

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  icon,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [onPress]);

  const vs = VARIANT_STYLES[variant];
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        {
          height: SIZE_HEIGHTS[size],
          borderRadius: SIZE_RADIUS[size],
          backgroundColor: vs.bg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingHorizontal: 16,
          opacity: isDisabled ? 0.5 : 1,
          ...(vs.border ? { borderWidth: 1, borderColor: vs.border } : {}),
          ...(fullWidth ? {} : { alignSelf: 'flex-start' as const }),
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vs.text} />
      ) : (
        <>
          {icon}
          <Text
            style={{
              color: vs.text,
              fontSize: SIZE_TEXT[size],
              fontFamily: 'Rubik-SemiBold',
            }}
          >
            {label}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}
