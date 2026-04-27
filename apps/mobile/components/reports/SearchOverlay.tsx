import { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SectionList,
  FlatList,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import type BottomSheet from '@gorhom/bottom-sheet';

import { COLORS } from '@infield/ui';
import { DEFECT_CATEGORIES, CATEGORY_LABELS } from '@infield/shared';
import { BottomSheetWrapper } from '@/components/ui/BottomSheetWrapper';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDefectLibrary } from '@/hooks/useDefectLibrary';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import type { DefectLibraryItem } from '@/hooks/useDefectLibrary';

// --- Types ---

interface SearchOverlayProps {
  reportId: string;
  onClose: () => void;
}

// --- Category Chips Row (Multi-Select) ---

function CategoryChipsRow({
  selectionOrder,
  onToggle,
  onClear,
}: {
  selectionOrder: string[];
  onToggle: (categoryValue: string) => void;
  onClear: () => void;
}) {
  const selectedSet = new Set(selectionOrder);

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row-reverse',
          gap: 8,
          paddingVertical: 8,
        }}
      >
        {DEFECT_CATEGORIES.map((cat) => {
          const isSelected = selectedSet.has(cat.value);
          return (
            <Pressable
              key={cat.value}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                onToggle(cat.value);
              }}
              style={{
                backgroundColor: isSelected
                  ? COLORS.primary[500]
                  : 'transparent',
                borderWidth: isSelected ? 0 : 1,
                borderColor: COLORS.cream[200],
                borderRadius: 18,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: isSelected ? 'Rubik-SemiBold' : 'Rubik-Medium',
                  fontWeight: isSelected ? '600' : '500',
                  color: isSelected ? COLORS.white : COLORS.neutral[600],
                }}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {selectionOrder.length > 0 && (
        <Pressable
          onPress={onClear}
          style={{
            alignSelf: 'flex-end',
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Rubik-Regular',
              color: COLORS.primary[500],
            }}
          >
            נקה
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// --- Search Input ---

function SearchInput({
  query,
  onChangeText,
  onClear,
}: {
  query: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}) {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: COLORS.cream[100],
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        borderRadius: 10,
        paddingHorizontal: 12,
        gap: 8,
      }}
    >
      <Feather name="search" size={16} color={COLORS.neutral[400]} />
      <TextInput
        value={query}
        onChangeText={onChangeText}
        placeholder="חיפוש לפי שם או תיאור..."
        placeholderTextColor={COLORS.neutral[400]}
        textAlign="right"
        autoFocus
        style={{
          flex: 1,
          fontSize: Platform.OS === 'ios' ? 16 : 14,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[800],
          paddingVertical: 10,
          writingDirection: 'rtl',
        }}
      />
      {query.length > 0 && (
        <Pressable onPress={onClear} hitSlop={8}>
          <Feather name="x-circle" size={16} color={COLORS.neutral[400]} />
        </Pressable>
      )}
    </View>
  );
}

// --- Result Item ---

function ResultItem({
  item,
  index,
  onPress,
}: {
  item: DefectLibraryItem;
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(Math.min(index, 10) * 40).duration(200)}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'flex-start',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
          gap: 10,
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-Medium',
              color: COLORS.neutral[800],
              textAlign: 'right',
              marginBottom: 4,
            }}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {item.category && (
              <View
                style={{
                  backgroundColor: COLORS.cream[100],
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[600],
                  }}
                >
                  {CATEGORY_LABELS[
                    item.category as keyof typeof CATEGORY_LABELS
                  ] || item.category}
                </Text>
              </View>
            )}

            {item.price && (
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[400],
                }}
              >
                ₪{item.price}
              </Text>
            )}
          </View>
        </View>

        <Feather
          name="chevron-left"
          size={16}
          color={COLORS.neutral[300]}
          style={{ marginTop: 2 }}
        />
      </Pressable>
    </Animated.View>
  );
}

// --- Empty States ---

function InitialEmptyState() {
  return (
    <EmptyState
      icon="filter"
      title="בחר קטגוריות או חפש"
      subtitle="בחר קטגוריות או הקלד מילות חיפוש כדי למצוא ממצאים מהמאגר"
    />
  );
}

function NoResultsEmptyState() {
  return (
    <EmptyState
      icon="search"
      title="לא נמצאו ממצאים"
      subtitle="נסה לשנות את הסינון או את מילת החיפוש"
    />
  );
}

function LoadingState() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
      }}
    >
      <ActivityIndicator size="large" color={COLORS.primary[500]} />
    </View>
  );
}

// --- Main Component ---

export function SearchOverlay({ reportId, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const sheetRef = useRef<BottomSheet>(null);
  const [query, setQuery] = useState('');
  const [queryDebounced, setQueryDebounced] = useState('');
  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);

  // Debounce search query (250ms)
  useMemo(() => {
    const timer = setTimeout(() => {
      setQueryDebounced(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch library items
  const { items: libraryItems, isLoading: libraryLoading } = useDefectLibrary();

  // Filter and group results
  const { filtered, grouped, flatSorted } = useSearchFilter(
    libraryItems,
    selectionOrder,
    queryDebounced
  );

  // Handle category toggle (single source of truth: selectionOrder array)
  const handleCategoryToggle = useCallback((categoryValue: string) => {
    setSelectionOrder((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : [...prev, categoryValue]
    );
  }, []);

  const handleClear = useCallback(() => {
    setSelectionOrder([]);
  }, []);

  // Handle result selection
  const handleSelectItem = useCallback(
    (item: DefectLibraryItem) => {
      onClose();
      router.push({
        pathname: '/(app)/reports/[id]/add-defect',
        params: {
          id: reportId,
          templateId: item.id,
        },
      });
    },
    [reportId, router, onClose]
  );

  // Determine current state
  const isFilterActive = selectionOrder.length > 0 || queryDebounced.trim();
  const hasResults = filtered.length > 0;

  return (
    <BottomSheetWrapper ref={sheetRef} snapPoints={['85%']} onClose={onClose}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Rubik-SemiBold',
              color: COLORS.neutral[800],
              textAlign: 'right',
            }}
          >
            חיפוש ממצאים
          </Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Feather name="x" size={20} color={COLORS.neutral[400]} />
          </Pressable>
        </View>

        {/* Search Input */}
        <SearchInput
          query={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
        />

        {/* Category Chips */}
        <CategoryChipsRow
          selectionOrder={selectionOrder}
          onToggle={handleCategoryToggle}
          onClear={handleClear}
        />

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: COLORS.cream[200],
            marginBottom: 4,
          }}
        />

        {/* Content Area — Four States */}

        {/* STATE 1: Initial (no filter) */}
        {!isFilterActive && !libraryLoading && <InitialEmptyState />}

        {/* STATE 2: Results */}
        {isFilterActive &&
          hasResults &&
          !libraryLoading &&
          (grouped ? (
            <SectionList
              sections={grouped.map((g) => ({
                category: g.category,
                categoryLabel: g.categoryLabel,
                data: g.items,
              }))}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <ResultItem
                  item={item}
                  index={index}
                  onPress={() => handleSelectItem(item)}
                />
              )}
              renderSectionHeader={({ section: { categoryLabel, data } }) => (
                <View
                  style={{
                    backgroundColor: COLORS.cream[100],
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.cream[200],
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Rubik-SemiBold',
                      color: COLORS.neutral[700],
                      textAlign: 'right',
                    }}
                  >
                    {categoryLabel} ({data.length})
                  </Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 32 }}
              scrollEnabled={true}
            />
          ) : (
            <FlatList
              data={flatSorted}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <ResultItem
                  item={item}
                  index={index}
                  onPress={() => handleSelectItem(item)}
                />
              )}
              contentContainerStyle={{ paddingBottom: 32 }}
            />
          ))}

        {/* STATE 3: No Results After Filter */}
        {isFilterActive && !hasResults && !libraryLoading && (
          <NoResultsEmptyState />
        )}

        {/* STATE 4: Loading */}
        {libraryLoading && <LoadingState />}
      </View>
    </BottomSheetWrapper>
  );
}
