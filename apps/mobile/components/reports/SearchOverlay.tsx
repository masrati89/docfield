import { useRef, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';
import type BottomSheet from '@gorhom/bottom-sheet';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { BottomSheetWrapper } from '@/components/ui/BottomSheetWrapper';
import { useDefectLibrary } from '@/hooks/useDefectLibrary';
import type { DefectItem } from '@/hooks/useReport';

// --- Types ---

/** Unified item for both report defects and library entries */
interface SearchItem {
  id: string;
  description: string;
  category: string | null;
  room: string | null;
  photoCount: number;
  origin: 'report' | 'library';
}

interface SearchOverlayProps {
  defects: DefectItem[];
  onSelect: (defectId: string) => void;
  onClose: () => void;
}

// --- Chip component with press animation ---

interface ChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function CategoryChip({ label, isActive, onPress }: ChipProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: BORDER_RADIUS.full,
          backgroundColor: isActive ? COLORS.primary[500] : COLORS.cream[100],
          borderWidth: 1,
          borderColor: isActive ? COLORS.primary[500] : COLORS.cream[200],
          marginEnd: 8,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: isActive ? 'Rubik-SemiBold' : 'Rubik-Regular',
            color: isActive ? COLORS.white : COLORS.neutral[600],
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// --- Result item component ---

interface ResultItemProps {
  item: SearchItem;
  index: number;
  onPress: () => void;
}

function ResultItem({ item, index, onPress }: ResultItemProps) {
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

  const isLibrary = item.origin === 'library';

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
        {/* Description + metadata */}
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
            {item.description}
          </Text>

          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {/* Origin badge */}
            <View
              style={{
                backgroundColor: isLibrary
                  ? COLORS.gold[100]
                  : COLORS.primary[50],
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Rubik-Medium',
                  color: isLibrary ? COLORS.gold[600] : COLORS.primary[700],
                }}
              >
                {isLibrary ? 'מאגר' : 'דוח'}
              </Text>
            </View>

            {/* Category badge */}
            {item.category ? (
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
                  {item.category}
                </Text>
              </View>
            ) : null}

            {/* Room/location */}
            {item.room ? (
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[400],
                }}
              >
                {item.room}
              </Text>
            ) : null}

            {/* Photo count */}
            {item.photoCount > 0 ? (
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Feather name="camera" size={10} color={COLORS.neutral[400]} />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[400],
                  }}
                >
                  {item.photoCount}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Chevron */}
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

// --- Main component ---

export function SearchOverlay({
  defects,
  onSelect,
  onClose,
}: SearchOverlayProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('הכל');

  // Fetch global defect library
  const { items: libraryItems, isLoading: libraryLoading } = useDefectLibrary();

  // Merge report defects + library items into unified SearchItem[]
  const allItems: SearchItem[] = useMemo(() => {
    const reportItems: SearchItem[] = defects.map((d) => ({
      id: d.id,
      description: d.description,
      category: d.category,
      room: d.room,
      photoCount: d.photoCount,
      origin: 'report' as const,
    }));

    const libItems: SearchItem[] = libraryItems.map((lib) => ({
      id: `lib-${lib.id}`,
      description: lib.title,
      category: lib.category || null,
      room: null,
      photoCount: 0,
      origin: 'library' as const,
    }));

    // Report defects first, then library
    return [...reportItems, ...libItems];
  }, [defects, libraryItems]);

  // Build unique category list from all items
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = ['הכל'];
    allItems.forEach((d) => {
      if (d.category && !seen.has(d.category)) {
        seen.add(d.category);
        result.push(d.category);
      }
    });
    return result;
  }, [allItems]);

  // Filter logic
  const filtered = useMemo(() => {
    let items = allItems;
    if (activeCategory !== 'הכל') {
      items = items.filter((d) => d.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((d) => d.description.toLowerCase().includes(q));
    }
    return items;
  }, [allItems, activeCategory, query]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      if (item.origin === 'report') {
        onSelect(item.id);
      }
      onClose();
    },
    [onSelect, onClose]
  );

  const handleCategoryPress = (cat: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveCategory(cat);
  };

  const reportCount = filtered.filter((i) => i.origin === 'report').length;
  const libraryCount = filtered.filter((i) => i.origin === 'library').length;

  return (
    <>
      <BottomSheetWrapper
        ref={sheetRef}
        snapPoints={['85%']}
        onClose={handleClose}
      >
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
            <Pressable onPress={handleClose} hitSlop={8}>
              <Feather name="x" size={20} color={COLORS.neutral[400]} />
            </Pressable>
          </View>

          {/* Search input */}
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
              onChangeText={setQuery}
              placeholder="חפש ממצא בדוח או במאגר..."
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
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Feather
                  name="x-circle"
                  size={16}
                  color={COLORS.neutral[400]}
                />
              </Pressable>
            )}
          </View>

          {/* Category chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: 'row-reverse',
              paddingHorizontal: 16,
              paddingBottom: 12,
            }}
          >
            {categories.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                isActive={activeCategory === cat}
                onPress={() => handleCategoryPress(cat)}
              />
            ))}
          </ScrollView>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: COLORS.cream[200],
              marginBottom: 4,
            }}
          />

          {/* Results count */}
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
              textAlign: 'right',
              paddingHorizontal: 16,
              paddingVertical: 6,
            }}
          >
            {reportCount} בדוח · {libraryCount} במאגר
            {libraryLoading ? ' (טוען...)' : ''}
          </Text>

          {/* Results list */}
          {filtered.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 40,
              }}
            >
              <Feather name="search" size={48} color={COLORS.cream[300]} />
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  fontFamily: 'Rubik-Medium',
                  color: COLORS.neutral[500],
                  textAlign: 'center',
                }}
              >
                לא נמצאו ממצאים
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[400],
                  textAlign: 'center',
                }}
              >
                נסה מילת חיפוש אחרת או שנה קטגוריה
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item, index }) => (
                <ResultItem
                  item={item}
                  index={index}
                  onPress={() => handleSelect(item)}
                />
              )}
              contentContainerStyle={{ paddingBottom: 32 }}
            />
          )}
        </View>
      </BottomSheetWrapper>
    </>
  );
}
