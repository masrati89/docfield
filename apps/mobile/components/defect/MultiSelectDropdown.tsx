import { useMemo } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';
import { COLORS } from '@infield/ui';
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { DropdownBase } from './DropdownBase';
import { useMultiDropdown } from '@/hooks/useMultiDropdown';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (selected: string[]) => void;
  maxHeight?: number;
}

function CheckboxItem({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 10,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[100],
        }}
      >
        {/* Checkbox */}
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: isSelected ? COLORS.primary[500] : COLORS.cream[300],
            backgroundColor: isSelected ? COLORS.primary[500] : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isSelected && (
            <Feather name="check" size={14} color={COLORS.white} />
          )}
        </View>

        {/* Label */}
        <Text
          style={{
            flex: 1,
            fontSize: 13,
            fontFamily: isSelected ? 'Rubik-Medium' : 'Rubik-Regular',
            color: isSelected ? COLORS.primary[700] : COLORS.neutral[700],
            textAlign: 'right',
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onSelectionChange,
  maxHeight = 300,
}: MultiSelectDropdownProps) {
  const dropdown = useMultiDropdown(options, selectedValues, onSelectionChange);

  const canClearAll = useMemo(
    () => dropdown.selectedCount > 0,
    [dropdown.selectedCount]
  );

  return (
    <DropdownBase
      label={label}
      isOpen={dropdown.isOpen}
      onToggle={dropdown.toggleOpen}
      selectedCount={dropdown.selectedCount}
      maxHeight={maxHeight}
    >
      {/* Options list */}
      {options.map((option) => (
        <CheckboxItem
          key={option}
          label={option}
          isSelected={dropdown.isSelected(option)}
          onPress={() => dropdown.toggleOption(option)}
        />
      ))}

      {/* Clear all button */}
      {canClearAll && (
        <View style={{ borderTopWidth: 1, borderTopColor: COLORS.cream[200] }}>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              dropdown.clearAll();
            }}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 10,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-Medium',
                color: COLORS.primary[500],
              }}
            >
              נקה הכל
            </Text>
          </Pressable>
        </View>
      )}
    </DropdownBase>
  );
}
