import { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import '../global.css';

export default function WelcomeScreen() {
  // Scale animation for button press (GPU-only: transform)
  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = useCallback(() => {
    buttonScale.value = withSpring(0.97, {
      damping: 15,
      stiffness: 150,
    });
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    buttonScale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  }, [buttonScale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: router.push('/(tabs)')
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />

      <View className="flex-1 items-center justify-center px-[20px]">
        {/* Logo — enters first (0ms delay), spring physics */}
        <Animated.View
          entering={FadeInUp.duration(600).springify()}
          className="items-center"
        >
          {/* Logo icon placeholder — green-700 square with rounded corners */}
          <View className="w-[72px] h-[72px] rounded-xl bg-primary-700 items-center justify-center mb-[16px]">
            <Text className="text-white text-[28px] font-rubik-bold">
              DF
            </Text>
          </View>

          {/* App name — dominant presence, Rubik Bold */}
          <Text className="text-[32px] font-rubik-bold text-primary-700">
            DocField
          </Text>
        </Animated.View>

        {/* Tagline — enters second (150ms delay) */}
        <Animated.View
          entering={FadeInUp.delay(150).duration(500).springify()}
          className="mt-[12px] mb-[48px]"
        >
          <Text className="text-[15px] font-rubik text-neutral-500 text-center leading-[22.5px]">
            {'דוחות מסירה, בדק בית ופיקוח\nבלחיצת כפתור'}
          </Text>
        </Animated.View>

        {/* CTA Button — enters third (300ms delay), single primary action */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400).springify()}
          className="w-full"
          style={buttonAnimatedStyle}
        >
          <Pressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="bg-primary-500 h-[52px] rounded-[14px] items-center justify-center active:bg-primary-600"
          >
            <Text className="text-white text-[15px] font-rubik-semibold">
              התחל
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Version indicator — subtle, at bottom */}
      <Animated.View
        entering={FadeInUp.delay(500).duration(300)}
        className="items-center pb-[8px]"
      >
        <Text className="text-[11px] font-rubik-medium text-neutral-400">
          גרסה 0.0.1
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}
