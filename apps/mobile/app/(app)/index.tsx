import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Stats {
  projectCount: number;
  reportCount: number;
}

export default function HomeScreen() {
  const { profile, signOut } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const [projectsResult, reportsResult] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase
          .from('delivery_reports')
          .select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        projectCount: projectsResult.count ?? 0,
        reportCount: reportsResult.count ?? 0,
      });
    } catch {
      // Silent fail for now — will show 0
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500).springify()}>
          <Text className="text-[24px] font-rubik-bold text-neutral-800">
            שלום{profile?.fullName ? `, ${profile.fullName}` : ''}!
          </Text>
          <Text className="text-[15px] font-rubik text-neutral-500 mt-[4px]">
            {roleLabel}
          </Text>
        </Animated.View>

        {/* Stats cards */}
        <Animated.View
          entering={FadeInUp.delay(150).duration(500).springify()}
          className="flex-row gap-[12px] mt-[24px]"
        >
          <View className="flex-1 bg-white rounded-[14px] border border-cream-200 p-[16px]">
            {isLoading ? (
              <View className="animate-pulse">
                <View className="h-[14px] bg-cream-200 rounded w-[60%] mb-[8px]" />
                <View className="h-[28px] bg-cream-200 rounded w-[40%]" />
              </View>
            ) : (
              <>
                <Text className="text-[13px] font-rubik text-neutral-500">
                  פרויקטים
                </Text>
                <Text className="text-[28px] font-rubik-bold text-primary-700 mt-[4px]">
                  {stats?.projectCount ?? 0}
                </Text>
              </>
            )}
          </View>

          <View className="flex-1 bg-white rounded-[14px] border border-cream-200 p-[16px]">
            {isLoading ? (
              <View className="animate-pulse">
                <View className="h-[14px] bg-cream-200 rounded w-[60%] mb-[8px]" />
                <View className="h-[28px] bg-cream-200 rounded w-[40%]" />
              </View>
            ) : (
              <>
                <Text className="text-[13px] font-rubik text-neutral-500">
                  דוחות
                </Text>
                <Text className="text-[28px] font-rubik-bold text-info-500 mt-[4px]">
                  {stats?.reportCount ?? 0}
                </Text>
              </>
            )}
          </View>
        </Animated.View>

        {/* Placeholder content */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(500).springify()}
          className="flex-1 items-center justify-center"
        >
          <View className="w-[64px] h-[64px] rounded-xl bg-primary-50 items-center justify-center mb-[16px]">
            <Text className="text-[28px]">🏗️</Text>
          </View>
          <Text className="text-[17px] font-rubik-semibold text-neutral-700 mb-[8px]">
            הדשבורד בבנייה
          </Text>
          <Text className="text-[15px] font-rubik text-neutral-500 text-center">
            בקרוב יופיעו כאן הפרויקטים והדוחות שלך
          </Text>
        </Animated.View>

        {/* Sign out button */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(400).springify()}
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
