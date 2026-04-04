import { Text, Pressable, ScrollView } from 'react-native';

import { COLORS } from '@infield/ui';
import { DEFECT_CATEGORIES } from '@infield/shared';

// --- Types ---

interface CategoryPickerProps {
  selected: string;
  onSelect: (value: string) => void;
}

// --- Component ---

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: 'row-reverse',
        gap: 6,
        paddingVertical: 2,
      }}
    >
      {DEFECT_CATEGORIES.map((cat) => {
        const isSelected = selected === cat.value;
        return (
          <Pressable
            key={cat.value}
            onPress={() => onSelect(cat.value)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              backgroundColor: isSelected ? COLORS.primary[500] : 'transparent',
              borderWidth: 1,
              borderColor: isSelected ? COLORS.primary[500] : COLORS.cream[300],
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: isSelected ? '600' : '400',
                color: isSelected ? '#FFFFFF' : COLORS.neutral[600],
                fontFamily: isSelected ? 'Rubik-SemiBold' : 'Rubik-Regular',
              }}
            >
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
