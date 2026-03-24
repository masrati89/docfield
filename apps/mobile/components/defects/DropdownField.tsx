import { View, Text, Pressable, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownFieldProps {
  label: string;
  value?: string;
  options: readonly DropdownOption[];
  placeholder: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DropdownField({
  label,
  value,
  options,
  placeholder,
  onChange,
  error,
}: DropdownFieldProps) {
  const selectedOption = options.find((option) => option.value === value);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Use Alert with buttons for MVP (Bottom Sheet in v1.1)
    const buttons = options.map((option) => ({
      text: option.label,
      onPress: () => onChange(option.value),
    }));

    buttons.push({ text: 'ביטול', onPress: () => {} });

    Alert.alert(label, undefined, buttons);
  };

  return (
    <View>
      <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
        {label}
      </Text>
      <Pressable
        onPress={handlePress}
        className="h-[50px] rounded-[10px] flex-row items-center px-[16px] active:bg-cream-100"
        style={{
          backgroundColor: COLORS.cream[50],
          borderWidth: 1.5,
          borderColor: error ? COLORS.danger[500] : COLORS.cream[300],
        }}
      >
        <Text
          className="flex-1 text-[15px] font-rubik"
          style={{
            color: selectedOption ? COLORS.neutral[700] : COLORS.neutral[400],
          }}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color={COLORS.neutral[400]} />
      </Pressable>
      {error ? (
        <View className="flex-row items-center mt-[4px]">
          <Feather name="alert-circle" size={14} color={COLORS.danger[700]} />
          <Text className="text-[13px] font-rubik text-danger-700 me-[4px]">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
