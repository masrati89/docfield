import { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useApartmentDetails } from '@/hooks/useProjects';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { CardSkeleton } from '@/components/ui/CardSkeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';

// --- Detail row ---

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-[12px] border-b border-cream-200">
      <Text className="text-[13px] font-rubik text-neutral-500">{label}</Text>
      <Text className="text-[15px] font-rubik-medium text-neutral-700">
        {value}
      </Text>
    </View>
  );
}

// --- Apartment type label ---

function getTypeLabel(type?: string): string {
  switch (type) {
    case 'garden':
      return 'דירת גן';
    case 'penthouse':
      return 'פנטהאוז';
    case 'duplex':
      return 'דופלקס';
    case 'studio':
      return 'סטודיו';
    default:
      return 'רגילה';
  }
}

export default function ApartmentDetailsScreen() {
  const { apartmentId } = useLocalSearchParams<{ apartmentId: string }>();
  const {
    data: apartment,
    isLoading,
    error,
    refetch,
  } = useApartmentDetails(apartmentId ?? '');

  const handleCreateReport = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Navigate to create report screen (Phase 6)
  }, []);

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <StatusBar style="dark" />
        <ScreenHeader title="פרטי דירה" showBack />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  if (isLoading || !apartment) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <StatusBar style="dark" />
        <ScreenHeader title="פרטי דירה" showBack />
        <View className="px-[20px] gap-[12px]">
          <CardSkeleton lines={3} showIcon={false} />
          <CardSkeleton lines={2} showIcon={false} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />
      <ScreenHeader title={`דירה ${apartment.number}`} showBack />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* General info card */}
        <Animated.View
          entering={FadeInUp.duration(300)}
          className="bg-white rounded-[14px] border border-cream-200 p-[16px] mb-[16px]"
        >
          <Text className="text-[17px] font-rubik-semibold text-neutral-800 mb-[4px]">
            מידע כללי
          </Text>

          <DetailRow label="מספר דירה" value={apartment.number} />
          {apartment.floor !== undefined && (
            <DetailRow label="קומה" value={String(apartment.floor)} />
          )}
          {apartment.roomsCount && (
            <DetailRow label="חדרים" value={String(apartment.roomsCount)} />
          )}
          <DetailRow
            label="סוג"
            value={getTypeLabel(apartment.apartmentType)}
          />

          {/* Status row (special — has badge) */}
          <View className="flex-row items-center justify-between py-[12px]">
            <Text className="text-[13px] font-rubik text-neutral-500">
              סטטוס
            </Text>
            <StatusBadge status={apartment.status} type="apartment" />
          </View>
        </Animated.View>

        {/* Existing reports */}
        {apartment.reportCount > 0 && (
          <Animated.View
            entering={FadeInUp.delay(100).duration(300)}
            className="bg-white rounded-[14px] border border-cream-200 p-[16px] mb-[16px]"
          >
            <Text className="text-[17px] font-rubik-semibold text-neutral-800 mb-[8px]">
              דוחות קיימים ({apartment.reportCount})
            </Text>
            <Text className="text-[13px] font-rubik text-neutral-500">
              {apartment.reportCount} דוחות מסירה קיימים לדירה זו
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Sticky CTA button */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(300)}
        className="px-[20px] pb-[24px] pt-[12px] bg-cream-50"
      >
        <Pressable
          onPress={handleCreateReport}
          className="h-[52px] rounded-[14px] bg-primary-500 flex-row items-center justify-center active:bg-primary-600 active:scale-[0.98]"
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
          <Text className="text-[15px] font-rubik-semibold text-white me-[8px]">
            צור דוח מסירה חדש
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
