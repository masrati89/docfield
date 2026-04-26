import { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from '@/lib/haptics';

import { COLORS } from '@infield/ui';

// --- Types ---

interface SocialAuthButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  isLoading: boolean;
  loadingProvider: 'google' | 'apple' | null;
}

// --- Constants ---

const BUTTON_HEIGHT = 50;
const BUTTON_RADIUS = 14;
const SPRING_CONFIG = { damping: 15, stiffness: 150 };

// --- Sub-components ---

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SocialButtonProps {
  onPress: () => void;
  isLoading: boolean;
  disabled: boolean;
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  children: React.ReactNode;
  accessibilityLabel: string;
}

function SocialButton({
  onPress,
  isLoading,
  disabled,
  backgroundColor,
  borderColor,
  borderWidth,
  children,
  accessibilityLabel,
}: SocialButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [onPress]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: disabled || isLoading }}
      style={[
        {
          height: BUTTON_HEIGHT,
          borderRadius: BUTTON_RADIUS,
          backgroundColor,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          paddingHorizontal: 16,
          opacity: disabled && !isLoading ? 0.5 : 1,
          ...(borderColor && borderWidth ? { borderWidth, borderColor } : {}),
        },
        animatedStyle,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

// --- Main Component ---

export function SocialAuthButtons({
  onGooglePress,
  onApplePress,
  isLoading,
  loadingProvider,
}: SocialAuthButtonsProps) {
  return (
    <View style={{ gap: 12 }}>
      {/* Google Button */}
      <SocialButton
        onPress={onGooglePress}
        isLoading={loadingProvider === 'google'}
        disabled={isLoading}
        backgroundColor={COLORS.white}
        borderColor="#E5E7EB"
        borderWidth={1.5}
        accessibilityLabel="המשך עם Google"
      >
        {loadingProvider === 'google' ? (
          <ActivityIndicator size="small" color="#3C4043" />
        ) : (
          <>
            <Text
              style={{
                fontFamily: 'Rubik-Medium',
                fontSize: 15,
                color: '#3C4043',
                textAlign: 'right',
              }}
            >
              המשך עם Google
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#4285F4',
                lineHeight: 24,
                fontFamily: 'Inter-Bold',
              }}
            >
              G
            </Text>
          </>
        )}
      </SocialButton>

      {/* Apple Button */}
      <SocialButton
        onPress={onApplePress}
        isLoading={loadingProvider === 'apple'}
        disabled={isLoading}
        backgroundColor={COLORS.black}
        accessibilityLabel="המשך עם Apple"
      >
        {loadingProvider === 'apple' ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <>
            <Text
              style={{
                fontFamily: 'Rubik-Medium',
                fontSize: 15,
                color: COLORS.white,
                textAlign: 'right',
              }}
            >
              המשך עם Apple
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: COLORS.white,
                lineHeight: 24,
              }}
            ></Text>
          </>
        )}
      </SocialButton>

      {/* Divider */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 4,
        }}
      >
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: COLORS.cream[200],
          }}
        />
        <View
          style={{
            paddingHorizontal: 12,
            backgroundColor: COLORS.cream[50],
          }}
        >
          <Text
            style={{
              fontFamily: 'Rubik-Regular',
              fontSize: 13,
              color: COLORS.neutral[400],
            }}
          >
            או
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: COLORS.cream[200],
          }}
        />
      </View>
    </View>
  );
}
