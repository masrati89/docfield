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
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';
import type BottomSheet from '@gorhom/bottom-sheet';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { BottomSheetWrapper } from '@/components/ui/BottomSheetWrapper';
import type { DefectItem } from '@/hooks/useReport';

// --- Types ---

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
  item: DefectItem;
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

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 40).duration(200)}
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
        {/* Left side: description + metadata */}
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
            {/* Category badge */}
            {item.category ? (
              <View
                style={{
                  backgroundColor: COLORS.primary[50],
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.primary[700],
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

  // Build unique category list from defects
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = ['הכל'];
    defects.forEach((d) => {
      if (d.category && !seen.has(d.category)) {
        seen.add(d.category);
        result.push(d.category);
      }
    });
    return result;
  }, [defects]);

  // Filter logic
  const filtered = useMemo(() => {
    let items = defects;
    if (activeCategory !== 'הכל') {
      items = items.filter((d) => d.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((d) => d.description.toLowerCase().includes(q));
    }
    return items;
  }, [defects, activeCategory, query]);

  const handleSelect = useCallback(
    (defectId: string) => {
      sheetRef.current?.close();
      onSelect(defectId);
    },
    [onSelect]
  );

  const handleCategoryPress = (cat: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveCategory(cat);
  };

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
          <Pressable onPress={() => sheetRef.current?.close()} hitSlop={8}>
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
            placeholder="חפש ממצא..."
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
              <Feather name="x-circle" size={16} color={COLORS.neutral[400]} />
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
          {filtered.length} ממצאים
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
                onPress={() => handleSelect(item.id)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
      </View>
    </BottomSheetWrapper>
  );
}
