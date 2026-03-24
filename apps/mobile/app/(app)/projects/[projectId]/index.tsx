import { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';
import type { BuildingWithCounts } from '@docfield/shared';

import { useBuildings } from '@/hooks/useProjects';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CardSkeleton } from '@/components/ui/CardSkeleton';

function BuildingCard({
  building,
  index,
  onPress,
}: {
  building: BuildingWithCounts;
  index: number;
  onPress: () => void;
}) {
  const progress =
    building.apartmentCount > 0
      ? building.deliveredCount / building.apartmentCount
      : 0;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Animated.View entering={FadeInUp.delay(index * 50).duration(200)}>
      <Pressable
        onPress={handlePress}
        className="bg-white rounded-[14px] border border-cream-200 p-[16px] mb-[12px] active:scale-[0.98]"
      >
        <View className="flex-row items-start">
          {/* Icon */}
          <View className="w-[44px] h-[44px] rounded-[10px] bg-primary-50 items-center justify-center">
            <Feather name="home" size={20} color={COLORS.primary[500]} />
          </View>

          {/* Content */}
          <View className="flex-1 me-[12px]">
            <Text
              className="text-[17px] font-rubik-semibold text-neutral-800"
              numberOfLines={1}
            >
              {building.name}
            </Text>
            {building.floorsCount && (
              <Text className="text-[13px] font-rubik text-neutral-500 mt-[2px]">
                {building.floorsCount} קומות
              </Text>
            )}
          </View>

          {/* Chevron */}
          <Feather name="chevron-left" size={20} color={COLORS.neutral[400]} />
        </View>

        {/* Progress bar */}
        <View className="mt-[12px]">
          <View className="h-[6px] bg-cream-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </View>
          <Text className="text-[13px] font-rubik text-neutral-600 mt-[6px]">
            {building.deliveredCount}/{building.apartmentCount} דירות נמסרו
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function BuildingsListScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const router = useRouter();
  const {
    data: buildings,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useBuildings(projectId ?? '');

  const handleBuildingPress = useCallback(
    (buildingId: string) => {
      router.push(`/(app)/projects/${projectId}/${buildingId}`);
    },
    [router, projectId]
  );

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <StatusBar style="dark" />
        <ScreenHeader title="בניינים" showBack />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />
      <ScreenHeader title="בניינים" showBack />

      {isLoading ? (
        <View className="px-[20px] gap-[12px]">
          {[0, 1, 2].map((index) => (
            <CardSkeleton key={index} lines={3} />
          ))}
        </View>
      ) : !buildings || buildings.length === 0 ? (
        <EmptyState
          icon="home"
          title="אין בניינים בפרויקט"
          description="הוסף בניין כדי להמשיך"
          actionLabel="+ הוסף בניין"
        />
      ) : (
        <FlatList
          data={buildings}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <BuildingCard
              building={item}
              index={index}
              onPress={() => handleBuildingPress(item.id)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={COLORS.primary[500]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
