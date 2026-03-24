import { useCallback } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/contexts/AuthContext';
import { COLORS } from '@docfield/ui';

export default function SettingsScreen() {
  const { profile, signOut } = useAuth();

  const handleSignOut = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await signOut();
  }, [signOut]);

  const roleLabel =
    profile?.role === 'admin'
      ? 'מנהל מערכת'
      : profile?.role === 'project_manager'
        ? 'מנהל פרויקטים'
        : 'מפקח';

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />

      <View className="flex-1 px-[20px] pt-[20px]">
        <Animated.View entering={FadeInUp.duration(500).springify()}>
          <Text className="text-[24px] font-rubik-bold text-neutral-800">
            הגדרות
          </Text>
        </Animated.View>

        {/* Profile card */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500).springify()}
          className="mt-[24px] bg-white rounded-[14px] border border-cream-200 p-[16px] flex-row items-center"
        >
          <View className="w-[48px] h-[48px] rounded-full bg-primary-50 items-center justify-center">
            <Feather name="user" size={24} color={COLORS.primary[500]} />
          </View>
          <View className="flex-1 me-[12px]">
            <Text className="text-[17px] font-rubik-semibold text-neutral-800">
              {profile?.fullName ?? ''}
            </Text>
            <Text className="text-[13px] font-rubik text-neutral-500 mt-[2px]">
              {roleLabel} · {profile?.email ?? ''}
            </Text>
          </View>
        </Animated.View>

        {/* Sign out */}
        <View className="flex-1" />
        <Animated.View
          entering={FadeInUp.delay(200).duration(400).springify()}
          className="pb-[16px]"
        >
          <Pressable
            onPress={handleSignOut}
            className="h-[48px] rounded-[14px] items-center justify-center border border-cream-300 bg-cream-100 active:bg-cream-200"
          >
            <Text className="text-[15px] font-rubik-medium text-neutral-600">
              התנתק
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
