import { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SectionList,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';
import type { ChecklistResultValue } from '@docfield/shared';
import type { ChecklistItemWithResult } from '@docfield/shared';

import {
  useChecklistData,
  useUpdateChecklistResult,
} from '@/hooks/useChecklist';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/CardSkeleton';
import { ChecklistItemCard } from '@/components/checklist/ChecklistItemCard';
import { ChecklistProgress } from '@/components/checklist/ChecklistProgress';

// --- Types ---

interface SectionData {
  title: string;
  completedCount: number;
  totalCount: number;
  data: ChecklistItemWithResult[];
}

// --- Loading Skeleton ---

function ChecklistSkeleton() {
  return (
    <View className="px-[20px] pt-[16px]">
      {[1, 2, 3].map((index) => (
        <View key={index} className="mb-[24px]">
          <View className="h-[20px] w-[120px] bg-cream-200 rounded-[6px] mb-[12px]" />
          <CardSkeleton lines={2} showIcon={false} />
          <View className="mt-[8px]">
            <CardSkeleton lines={2} showIcon={false} />
          </View>
        </View>
      ))}
    </View>
  );
}

// --- Section Header ---

function SectionHeader({
  title,
  completedCount,
  totalCount,
}: {
  title: string;
  completedCount: number;
  totalCount: number;
}) {
  return (
    <View className="bg-cream-100 px-[20px] py-[8px] flex-row items-center justify-between">
      <Text className="text-[15px] font-rubik-semibold text-neutral-700">
        {title}
      </Text>
      <Text className="text-[13px] font-rubik text-neutral-400">
        {completedCount}/{totalCount}
      </Text>
    </View>
  );
}

// --- Main Screen ---

export default function ChecklistScreen() {
  const router = useRouter();
  const { reportId, templateId } = useLocalSearchParams<{
    reportId: string;
    templateId: string;
  }>();

  // Data
  const {
    data: sections,
    isLoading,
    error,
    refetch,
  } = useChecklistData(templateId ?? '', reportId ?? '');

  const { mutation, updateNote } = useUpdateChecklistResult(
    templateId ?? '',
    reportId ?? ''
  );

  // Compute progress
  const { completed, total, hasDefects } = useMemo(() => {
    if (!sections) return { completed: 0, total: 0, hasDefects: false };

    let completedCount = 0;
    let totalCount = 0;
    let defectsFound = false;

    for (const section of sections) {
      for (const item of section.items) {
        totalCount++;
        if (item.result !== undefined) {
          completedCount++;
        }
        if (item.result === 'fail') {
          defectsFound = true;
        }
      }
    }

    return {
      completed: completedCount,
      total: totalCount,
      hasDefects: defectsFound,
    };
  }, [sections]);

  // Build section data for SectionList
  const sectionData: SectionData[] = useMemo(() => {
    if (!sections) return [];

    return sections.map((section) => {
      const sectionCompleted = section.items.filter(
        (item) => item.result !== undefined
      ).length;

      return {
        title: section.category.name,
        completedCount: sectionCompleted,
        totalCount: section.items.length,
        data: section.items,
      };
    });
  }, [sections]);

  // Handlers
  const handleStatusChange = useCallback(
    (itemId: string, result: ChecklistResultValue) => {
      if (!reportId) return;

      mutation.mutate({
        deliveryReportId: reportId,
        checklistItemId: itemId,
        result,
      });
    },
    [reportId, mutation]
  );

  const handleNoteChange = useCallback(
    (itemId: string, result: ChecklistResultValue, note: string) => {
      if (!reportId) return;
      updateNote(itemId, result, note);
    },
    [reportId, updateNote]
  );

  const navigateNext = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // TODO: Navigate to defects screen or summary
    // For now: go back with success message
    Alert.alert(
      'הבדיקה הושלמה',
      hasDefects
        ? `נמצאו ליקויים. בשלב הבא תוכל לפרט אותם.`
        : 'כל הפריטים תקינים!',
      [
        {
          text: 'אישור',
          onPress: () => router.back(),
        },
      ]
    );
  }, [hasDefects, router]);

  const handleFinish = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const uncheckedCount = total - completed;

    if (uncheckedCount > 0) {
      Alert.alert(
        'פריטים לא נבדקו',
        `יש ${uncheckedCount} פריטים שטרם נבדקו. להמשיך בכל זאת?`,
        [
          { text: 'חזור לבדיקה', style: 'cancel' },
          {
            text: 'המשך',
            onPress: () => navigateNext(),
          },
        ]
      );
    } else {
      navigateNext();
    }
  }, [total, completed, navigateNext]);

  // Render item
  const renderItem = useCallback(
    ({ item }: { item: ChecklistItemWithResult }) => (
      <View className="px-[20px]">
        <ChecklistItemCard
          item={item}
          onStatusChange={handleStatusChange}
          onNoteChange={handleNoteChange}
        />
      </View>
    ),
    [handleStatusChange, handleNoteChange]
  );

  // Render section header
  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionData }) => (
      <SectionHeader
        title={section.title}
        completedCount={section.completedCount}
        totalCount={section.totalCount}
      />
    ),
    []
  );

  // Key extractor
  const keyExtractor = useCallback(
    (item: ChecklistItemWithResult) => item.id,
    []
  );

  // Error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <StatusBar style="dark" />
        <ScreenHeader title="צ'קליסט בדיקה" showBack />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  // Empty state (no template selected or no items)
  if (!templateId) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <StatusBar style="dark" />
        <ScreenHeader title="צ'קליסט בדיקה" showBack />
        <EmptyState
          icon="clipboard"
          title="לא נבחרה תבנית"
          description="יש לבחור תבנית צ'קליסט בעת יצירת הדוח"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />
      <ScreenHeader title="צ'קליסט בדיקה" showBack />

      {/* Progress bar */}
      {!isLoading && (
        <Animated.View entering={FadeInUp.duration(300)}>
          <ChecklistProgress completed={completed} total={total} />
        </Animated.View>
      )}

      {/* Content */}
      {isLoading ? (
        <ChecklistSkeleton />
      ) : sectionData.length === 0 ? (
        <EmptyState
          icon="clipboard"
          title="אין פריטים בצ'קליסט"
          description="התבנית שנבחרה ריקה. נסה תבנית אחרת."
        />
      ) : (
        <SectionList
          sections={sectionData}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={keyExtractor}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          SectionSeparatorComponent={() => <View className="h-[8px]" />}
        />
      )}

      {/* Fixed CTA button */}
      {!isLoading && sectionData.length > 0 && (
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
            <Pressable
              onPress={handleFinish}
              disabled={completed === 0}
              className={`
                h-[52px] rounded-[14px] bg-primary-500
                flex-row items-center justify-center
                active:bg-primary-600 active:scale-[0.98]
                ${completed === 0 ? 'opacity-50' : ''}
              `}
            >
              <Feather
                name={hasDefects ? 'alert-triangle' : 'check-circle'}
                size={18}
                color="#FFFFFF"
              />
              <Text className="text-[15px] font-rubik-semibold text-white me-[8px]">
                {hasDefects ? 'סיום וצפייה בליקויים' : 'סיום בדיקה'}
              </Text>
            </Pressable>
          </SafeAreaView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
