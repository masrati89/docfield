import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';

// --- Types ---

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (cat: string) => void;
  onCustom?: () => void;
}

// --- Component ---

export function CategoryChips({
  categories,
  selectedCategory,
  onSelect,
  onCustom,
}: CategoryChipsProps) {
  const handlePress = (cat: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelect(cat);
  };

  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: 8,
        maxHeight: 88,
      }}
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <Pressable
            key={cat}
            onPress={() => handlePress(cat)}
            style={{
              backgroundColor: isSelected ? COLORS.primary[500] : 'transparent',
              borderWidth: isSelected ? 0 : 1,
              borderColor: COLORS.cream[200],
              borderRadius: 18,
              paddingHorizontal: 14,
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
              {cat}
            </Text>
          </Pressable>
        );
      })}

      {/* "Other" chip */}
      {onCustom && (
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onCustom();
          }}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 4,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: COLORS.cream[200],
            borderRadius: 18,
            paddingHorizontal: 14,
            paddingVertical: 6,
          }}
        >
          <Feather name="plus" size={10} color={COLORS.neutral[600]} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Rubik-Medium',
              fontWeight: '500',
              color: COLORS.neutral[600],
            }}
          >
            {'אחר\u2026'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
