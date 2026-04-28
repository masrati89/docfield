import { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  RefreshControl,
  Platform,
  I18nManager,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';
import { useDefectLibrary } from '@/hooks/useDefectLibrary';
import {
  DefectLibraryCard,
  MultiSelectDropdown,
  StandardAutocomplete,
  SelectedChips,
} from '@/components/defect';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';
import { EmptyState } from '@/components/ui/EmptyState';
import type { DefectLibraryItem } from '@/hooks/useDefectLibrary';

// --- Skeleton Loading ---

function LibrarySkeleton() {
  return (
    <View style={{ paddingHorizontal: 16, gap: 10 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <View
          key={i}
          style={{
            backgroundColor: COLORS.cream[50],
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            padding: 14,
            gap: 8,
          }}
        >
          <SkeletonBlock width="75%" height={14} borderRadius={6} />
          <View style={{ flexDirection: 'row-reverse', gap: 6 }}>
            <SkeletonBlock width={60} height={20} borderRadius={10} />
            <SkeletonBlock width={44} height={20} borderRadius={10} />
          </View>
        </View>
      ))}
    </View>
  );
}

// --- Error State ---

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 12,
      }}
    >
      <Feather name="alert-circle" size={48} color={COLORS.neutral[300]} />
      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Rubik-SemiBold',
          color: COLORS.neutral[700],
          textAlign: 'center',
        }}
      >
        שגיאה בטעינת המאגר
      </Text>
      <Text
        style={{
          fontSize: 13,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[400],
          textAlign: 'center',
        }}
      >
        לא ניתן היה לטעון את המאגר. בדוק את החיבור ונסה שוב.
      </Text>
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onRetry();
        }}
        style={({ pressed }) => ({
          marginTop: 8,
          paddingVertical: 10,
          paddingHorizontal: 24,
          borderRadius: 10,
          backgroundColor: pressed ? COLORS.primary[600] : COLORS.primary[500],
        })}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Rubik-SemiBold',
            color: COLORS.white,
          }}
        >
          נסה שוב
        </Text>
      </Pressable>
    </View>
  );
}

// --- Animated Library Card Item ---

function AnimatedLibraryItem({
  item,
  index,
}: {
  item: DefectLibraryItem;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInUp.delay(Math.min(index * 40, 300)).duration(220)}
    >
      <DefectLibraryCard
        item={item}
        onPress={() => {
          // Library browse mode — no action needed beyond haptic (already in card)
        }}
      />
    </Animated.View>
  );
}

// --- Screen ---

export default function LibraryScreen() {
  const router = useRouter();

  const {
    items,
    categories,
    standards,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    selectedStandard,
    setSelectedStandard,
    refetch,
  } = useDefectLibrary();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleRemoveCategory = useCallback(
    (cat: string) => {
      setCategoryFilter(categoryFilter.filter((c: string) => c !== cat));
    },
    [categoryFilter, setCategoryFilter]
  );

  const handleRemoveStandard = useCallback(() => {
    setSelectedStandard(undefined);
  }, [setSelectedStandard]);

  const handleClearAllFilters = useCallback(() => {
    setSearchQuery('');
    setCategoryFilter([]);
    setSelectedStandard(undefined);
  }, [setSearchQuery, setCategoryFilter, setSelectedStandard]);

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim().length > 0 ||
      categoryFilter.length > 0 ||
      selectedStandard !== undefined
    );
  }, [searchQuery, categoryFilter, selectedStandard]);

  const backScale = useSharedValue(1);
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  const handleBackPressIn = () => {
    backScale.value = withSpring(0.92, { damping: 15, stiffness: 200 });
  };
  const handleBackPressOut = () => {
    backScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  // --- Render ---

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: COLORS.cream[50] }}
    >
      <StatusBar style="dark" animated />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontFamily: 'Rubik-Bold',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        >
          מאגר ממצאים
        </Text>

        {/* Item count badge */}
        {!isLoading && items.length > 0 && (
          <View
            style={{
              marginStart: 8,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 10,
              backgroundColor: COLORS.primary[50],
              borderWidth: 1,
              borderColor: COLORS.primary[100],
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-Medium',
                color: COLORS.primary[600],
              }}
            >
              {items.length}
            </Text>
          </View>
        )}

        {/* Back button */}
        <Animated.View style={[{ marginStart: 8 }, backStyle]}>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(app)');
              }
            }}
            onPressIn={handleBackPressIn}
            onPressOut={handleBackPressOut}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.cream[100],
              borderWidth: 1,
              borderColor: COLORS.cream[200],
              ...SHADOWS.sm,
            }}
          >
            <Feather name="arrow-right" size={20} color={COLORS.neutral[600]} />
          </Pressable>
        </Animated.View>
      </View>

      {/* Search bar */}
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 12,
          flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
          alignItems: 'center',
          backgroundColor: COLORS.cream[100],
          borderRadius: BORDER_RADIUS.md,
          borderWidth: 1,
          borderColor: searchQuery ? COLORS.primary[300] : COLORS.cream[200],
          paddingHorizontal: 10,
          ...SHADOWS.sm,
        }}
      >
        <Feather
          name="search"
          size={18}
          color={searchQuery ? COLORS.primary[500] : COLORS.neutral[400]}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="חיפוש ממצא..."
          placeholderTextColor={COLORS.neutral[400]}
          style={{
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 8,
            fontSize: 14,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Feather name="x" size={16} color={COLORS.neutral[400]} />
          </Pressable>
        )}
      </View>

      {/* Filter dropdowns */}
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 12,
          marginBottom: 8,
          gap: 8,
        }}
      >
        <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
          <MultiSelectDropdown
            label="קטגוריה"
            options={categories}
            selectedValues={categoryFilter}
            onSelectionChange={setCategoryFilter}
            maxHeight={250}
          />
          <StandardAutocomplete
            label="תקן"
            standards={standards}
            selectedStandard={selectedStandard}
            onSelect={setSelectedStandard}
            maxHeight={250}
          />
        </View>

        {/* Selected categories chips */}
        {categoryFilter.length > 0 && (
          <SelectedChips
            items={categoryFilter}
            onRemove={handleRemoveCategory}
            color="green"
          />
        )}

        {/* Selected standard chip */}
        {selectedStandard && (
          <SelectedChips
            items={[selectedStandard]}
            onRemove={handleRemoveStandard}
            color="blue"
            prefix="תקן: "
          />
        )}

        {/* Clear all filters button */}
        {hasActiveFilters && (
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              handleClearAllFilters();
            }}
            style={{
              alignSelf: 'flex-end',
              paddingVertical: 4,
              paddingHorizontal: 8,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-Medium',
                color: COLORS.primary[500],
              }}
            >
              נקה הכל
            </Text>
          </Pressable>
        )}
      </View>

      {/* Results */}
      {isLoading ? (
        <LibrarySkeleton />
      ) : error ? (
        <ErrorState onRetry={handleRefresh} />
      ) : items.length === 0 ? (
        <View style={{ flex: 1 }}>
          <EmptyState
            icon="book-open"
            title={hasActiveFilters ? 'לא נמצאו ממצאים' : 'המאגר ריק'}
            subtitle={
              searchQuery.trim()
                ? 'נסה מונחי חיפוש אחרים'
                : categoryFilter.length > 0
                  ? 'אין ממצאים בקטגוריות שנבחרו'
                  : selectedStandard
                    ? 'אין ממצאים עם התקן הזה'
                    : 'הוסף ממצאים מסך "הוסף ממצא"'
            }
          />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary[500]}
              colors={[COLORS.primary[500]]}
            />
          }
          renderItem={({ item, index }) => (
            <AnimatedLibraryItem item={item} index={index} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
