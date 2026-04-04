import { View, Text, Pressable, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';

// --- Types ---

interface BathTypeSelectProps {
  value: 'shower' | 'bath';
  onChange: (value: 'shower' | 'bath') => void;
}

const OPTIONS: { key: 'shower' | 'bath'; label: string }[] = [
  { key: 'shower', label: 'מקלחון' },
  { key: 'bath', label: 'אמבטיה' },
];

// --- Component ---

export function BathTypeSelect({ value, onChange }: BathTypeSelectProps) {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        gap: 8,
        padding: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.cream[100],
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cream[200],
      }}
    >
      {OPTIONS.map((o) => {
        const isSelected = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onChange(o.key);
            }}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: isSelected ? COLORS.primary[500] : COLORS.cream[300],
              backgroundColor: isSelected ? COLORS.primary[500] : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: isSelected ? '600' : '400',
                color: isSelected ? '#FFFFFF' : COLORS.neutral[600],
                fontFamily: isSelected ? 'Rubik-SemiBold' : 'Rubik-Regular',
              }}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
