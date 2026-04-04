import { useCallback, useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';

import { NewInspectionSheet } from '@/components/ui/NewInspectionSheet';

export default function ReportsScreen() {
  const [showNewInspection, setShowNewInspection] = useState(false);

  const handleNewInspection = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowNewInspection(true);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />

      <View className="flex-1 px-[16px] pt-[16px]">
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500).springify()}>
          <Text className="text-[20px] font-rubik-bold text-neutral-800 text-right">
            הדוחות שלי
          </Text>
        </Animated.View>

        {/* Empty state */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500).springify()}
          className="flex-1 items-center justify-center"
        >
          <View className="w-[64px] h-[64px] rounded-xl bg-primary-50 items-center justify-center mb-[16px]">
            <Feather name="file-text" size={24} color="#1B7A44" />
          </View>
          <Text className="text-[17px] font-rubik-semibold text-neutral-700 mb-[8px]">
            אין דוחות עדיין
          </Text>
          <Text className="text-[15px] font-rubik text-neutral-500 text-center mb-[24px]">
            צור בדיקה חדשה כדי להתחיל
          </Text>
          <Pressable
            onPress={handleNewInspection}
            className="h-[44px] rounded-[14px] bg-primary-500 flex-row-reverse items-center px-[20px] active:bg-primary-600"
            accessibilityRole="button"
            accessibilityLabel="בדיקה חדשה"
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text className="text-[14px] font-rubik-semibold text-white ms-[8px]">
              בדיקה חדשה
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* FAB — Floating Action Button */}
      <Pressable
        onPress={handleNewInspection}
        className="absolute bg-primary-500 rounded-[14px] flex-row-reverse items-center px-[14px] h-[48px] active:bg-primary-600"
        style={{
          bottom: Platform.OS === 'ios' ? 100 : 80,
          left: 16,
          shadowColor: 'rgba(27,122,68,1)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
          zIndex: 25,
        }}
        accessibilityRole="button"
        accessibilityLabel="בדיקה חדשה"
      >
        <Feather name="plus" size={20} color="#FFFFFF" />
        <Text className="text-[12px] font-rubik-semibold text-white ms-[8px]">
          בדיקה חדשה
        </Text>
      </Pressable>

      {/* New Inspection Bottom Sheet */}
      <NewInspectionSheet
        visible={showNewInspection}
        onClose={() => setShowNewInspection(false)}
      />
    </SafeAreaView>
  );
}
