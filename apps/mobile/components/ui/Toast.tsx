import { useEffect } from 'react';
import { Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import type { ToastType } from '@/hooks/useToast';

// --- Types ---

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onDismiss: () => void;
}

// --- Constants ---

const TOAST_COLORS: Record<ToastType, string> = {
  success: COLORS.primary[500],
  error: COLORS.danger[700],
  info: COLORS.neutral[600],
};

const TOAST_ICONS: Record<ToastType, 'check' | 'x' | 'info'> = {
  success: 'check',
  error: 'x',
  info: 'info',
};

// --- Component ---

export function Toast({ message, type, visible, onDismiss }: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(-100, {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withDelay(
        50,
        withTiming(0, { duration: 200 }, (finished) => {
          if (finished) {
            runOnJS(onDismiss)();
          }
        })
      );
    }
  }, [visible, translateY, opacity, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: insets.top + 8,
          left: 16,
          right: 16,
          zIndex: 300,
        },
        animatedStyle,
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Pressable
        onPress={onDismiss}
        style={{
          backgroundColor: TOAST_COLORS[type],
          borderRadius: 10,
          minHeight: 44,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 8,
          shadowColor: '#141311',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
        accessibilityRole="alert"
      >
        <Feather name={TOAST_ICONS[type]} size={18} color={COLORS.white} />
        <Text
          style={{
            flex: 1,
            color: COLORS.white,
            fontSize: 13,
            fontFamily: 'Rubik-Medium',
            textAlign: 'right',
          }}
        >
          {message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
