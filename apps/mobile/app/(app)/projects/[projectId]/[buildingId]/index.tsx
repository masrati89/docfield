import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  RefreshControl,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';
import type {
  ApartmentStatus,
  ApartmentWithReportCount,
} from '@docfield/shared';

import { useApartments } from '@/hooks/useProjects';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { GridCardSkeleton } from '@/components/ui/CardSkeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';

import React from 'react';

// --- Filter pills ---

type FilterValue = 'all' | ApartmentStatus;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'הכל' },
  { value: 'pending', label: 'ממתין' },
  { value: 'in_progress', label: 'בתהליך' },
  { value: 'delivered', label: 'נמסר' },
  { value: 'completed', label: 'הושלם' },
];

function FilterPills({
  selected,
  counts,
  onSelect,
}: {
  selected: FilterValue;
  counts: Record<FilterValue, number>;
  onSelect: (value: FilterValue) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      className="mb-[16px]"
    >
      {FILTERS.map((filter) => {
        const isSelected = selected === filter.value;
        const count = counts[filter.value];
        return (
          <Pressable
            key={filter.value}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.selectionAsync();
              }
              onSelect(filter.value);
            }}
            className={`px-[16px] py-[8px] rounded-full ${
              isSelected
                ? 'bg-primary-50 border border-primary-500'
                : 'bg-cream-100 border border-cream-300'
            }`}
          >
            <Text
              className={`text-[13px] font-rubik-medium ${
                isSelected ? 'text-primary-700' : 'text-neutral-600'
              }`}
            >
              {filter.label}
              {count > 0 ? ` (${count})` : ''}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// --- Apartment card (memoized for FlashList) ---

const ApartmentCard = React.memo(function ApartmentCard({
  apartment,
  onPress,
}: {
  apartment: ApartmentWithReportCount;
  onPress: () => void;
}) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const typeLabel =
    apartment.apartmentType === 'garden'
      ? 'דירת גן'
      : apartment.apartmentType === 'penthouse'
        ? 'פנטהאוז'
        : apartment.apartmentType === 'duplex'
          ? 'דופלקס'
          : apartment.apartmentType === 'studio'
            ? 'סטודיו'
            : undefined;

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-[14px] border border-cream-200 p-[16px] flex-1 m-[6px] active:scale-[0.98]"
    >
      {/* Apartment number */}
      <Text className="text-[17px] font-rubik-semibold text-neutral-800 text-center">
        דירה {apartment.number}
      </Text>

      {/* Divider */}
      <View className="h-[1px] bg-cream-200 my-[8px]" />

      {/* Details */}
      {apartment.floor !== undefined && (
        <Text className="text-[13px] font-rubik text-neutral-500 text-center">
          קומה {apartment.floor}
        </Text>
      )}
      {apartment.roomsCount && (
        <Text className="text-[13px] font-rubik text-neutral-500 text-center">
          {apartment.roomsCount} חדרים
        </Text>
      )}
      {typeLabel && (
        <Text className="text-[13px] font-rubik text-neutral-500 text-center">
          {typeLabel}
        </Text>
      )}

      {/* Status badge */}
      <View className="items-center mt-[10px]">
        <StatusBadge status={apartment.status} type="apartment" />
      </View>
    </Pressable>
  );
});

export default function ApartmentsGridScreen() {
  const { projectId, buildingId } = useLocalSearchParams<{
    projectId: string;
    buildingId: string;
  }>();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterValue>('all');

  const {
    data: apartments,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useApartments(buildingId ?? '');

  const filteredApartments = useMemo(() => {
    if (!apartments) return [];
    if (filter === 'all') return apartments;
    return apartments.filter((apartment) => apartment.status === filter);
  }, [apartments, filter]);

  const counts = useMemo(() => {
    const result: Record<FilterValue, number> = {
      all: 0,
      pending: 0,
      in_progress: 0,
      delivered: 0,
      completed: 0,
    };
    if (!apartments) return result;
    result.all = apartments.length;
    for (const apartment of apartments) {
      result[apartment.status] = (result[apartment.status] ?? 0) + 1;
    }
    return result;
  }, [apartments]);

  const handleApartmentPress = useCallback(
    (apartmentId: string) => {
      router.push(`/(app)/projects/${projectId}/${buildingId}/${apartmentId}`);
    },
    [router, projectId, buildingId]
  );

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <StatusBar style="dark" />
        <ScreenHeader title="דירות" showBack />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />
      <ScreenHeader title="דירות" showBack />

      {isLoading ? (
        <View className="px-[20px]">
          <View className="flex-row gap-[12px] mb-[12px]">
            <View className="flex-1">
              <GridCardSkeleton />
            </View>
            <View className="flex-1">
              <GridCardSkeleton />
            </View>
          </View>
          <View className="flex-row gap-[12px]">
            <View className="flex-1">
              <GridCardSkeleton />
            </View>
            <View className="flex-1">
              <GridCardSkeleton />
            </View>
          </View>
        </View>
      ) : !apartments || apartments.length === 0 ? (
        <EmptyState
          icon="grid"
          title="אין דירות בבניין"
          description="הוסף דירות כדי להתחיל בדיקות"
          actionLabel="+ הוסף דירות"
        />
      ) : (
        <>
          <Animated.View entering={FadeInUp.duration(200)}>
            <FilterPills
              selected={filter}
              counts={counts}
              onSelect={setFilter}
            />
          </Animated.View>

          {filteredApartments.length === 0 ? (
            <EmptyState
              icon="search"
              title="לא נמצאו דירות"
              description="נסה לשנות את הסינון"
            />
          ) : (
            <FlashList
              data={filteredApartments}
              keyExtractor={(item) => item.id}
              numColumns={2}
              renderItem={({ item }) => (
                <ApartmentCard
                  apartment={item}
                  onPress={() => handleApartmentPress(item.id)}
                />
              )}
              contentContainerStyle={{
                paddingHorizontal: 14,
                paddingBottom: 20,
              }}
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
        </>
      )}
    </SafeAreaView>
  );
}
