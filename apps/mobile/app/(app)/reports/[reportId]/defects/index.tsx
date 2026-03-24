import { useCallback } from 'react';
import { View, Text, FlatList, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';
import type { DefectWithPhotos } from '@docfield/shared';

import { useDefects } from '@/hooks/useDefects';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/CardSkeleton';
import { DefectCard } from '@/components/defects/DefectCard';

// --- Loading Skeleton ---

function DefectsSkeleton() {
  return (
    <View className="px-[20px] pt-[16px]">
      {[1, 2, 3].map((index) => (
        <View key={index} className="mb-[8px]">
          <CardSkeleton lines={2} showIcon={false} />
        </View>
      ))}
    </View>
  );
}

// --- Main Screen ---

export default function DefectsListScreen() {
  const router = useRouter();
  const { reportId } = useLocalSearchParams<{ reportId: string }>();

  const {
    data: defects,
    isLoading,
    error,
    refetch,
  } = useDefects(reportId ?? '');

  const handleDefectPress = useCallback(
    (defectId: string) => {
      router.push({
        pathname: '/reports/[reportId]/defects/[defectId]',
        params: { reportId: reportId ?? '', defectId },
      });
    },
    [router, reportId]
  );

  const handleAddDefect = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate to new defect (defectId = "new")
    router.push({
      pathname: '/reports/[reportId]/defects/[defectId]',
      params: { reportId: reportId ?? '', defectId: 'new' },
    });
  }, [router, reportId]);

  const handleFinish = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Navigate to signatures screen
    // For now: go back to report flow
    router.back();
  }, [router]);

  const renderItem = useCallback(
    ({ item, index }: { item: DefectWithPhotos; index: number }) => (
      <Animated.View
        entering={FadeInUp.delay(index * 50).duration(300)}
        className="px-[20px]"
      >
        <DefectCard defect={item} onPress={() => handleDefectPress(item.id)} />
      </Animated.View>
    ),
    [handleDefectPress]
  );

  const keyExtractor = useCallback((item: DefectWithPhotos) => item.id, []);

  // Error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <StatusBar style="dark" />
        <ScreenHeader title="ליקויים" showBack />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const defectCount = defects?.length ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />
      <ScreenHeader title="ליקויים" showBack />

      {/* Counter */}
      {!isLoading && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          className="px-[20px] pb-[12px]"
        >
          <Text className="text-[13px] font-rubik text-neutral-500">
            {defectCount > 0
              ? `${defectCount} ליקויים נמצאו`
              : 'לא נמצאו ליקויים'}
          </Text>
        </Animated.View>
      )}

      {/* Content */}
      {isLoading ? (
        <DefectsSkeleton />
      ) : defectCount === 0 ? (
        <EmptyState
          icon="check-circle"
          title="לא נמצאו ליקויים"
          description="כל הפריטים בצ'קליסט תקינים"
          actionLabel="הוסף ליקוי ידנית"
          onAction={handleAddDefect}
        />
      ) : (
        <FlatList
          data={defects}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
        />
      )}

      {/* Bottom buttons — fixed */}
      {!isLoading && (
        <Animated.View
          entering={FadeInUp.delay(200).duration(300)}
          className="absolute bottom-0 left-0 right-0 px-[20px] pb-[24px] pt-[12px] bg-cream-50"
          style={{
            shadowColor: COLORS.neutral[900],
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <SafeAreaView edges={['bottom']}>
            {/* Add defect button */}
            <Pressable
              onPress={handleAddDefect}
              className="h-[48px] rounded-[14px] flex-row items-center justify-center mb-[8px] active:bg-cream-200"
              style={{
                backgroundColor: COLORS.cream[100],
                borderWidth: 1,
                borderColor: COLORS.cream[300],
              }}
            >
              <Feather name="plus" size={18} color={COLORS.primary[700]} />
              <Text className="text-[15px] font-rubik-medium text-primary-700 me-[6px]">
                הוסף ליקוי נוסף
              </Text>
            </Pressable>

            {/* Continue button */}
            <Pressable
              onPress={handleFinish}
              className="h-[52px] rounded-[14px] bg-primary-500 flex-row items-center justify-center active:bg-primary-600 active:scale-[0.98]"
            >
              <Feather name="arrow-left" size={18} color="#FFFFFF" />
              <Text className="text-[15px] font-rubik-semibold text-white me-[8px]">
                המשך לסיכום
              </Text>
            </Pressable>
          </SafeAreaView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
