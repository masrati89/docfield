import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';
import type { ChecklistResultValue } from '@docfield/shared';

// --- Types ---

interface StatusOption {
  value: ChecklistResultValue;
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  selectedBackground: string;
  selectedBorder: string;
  selectedText: string;
  selectedIcon: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'pass',
    label: 'תקין',
    icon: 'check',
    selectedBackground: COLORS.success[50],
    selectedBorder: COLORS.success[500],
    selectedText: COLORS.success[700],
    selectedIcon: COLORS.success[500],
  },
  {
    value: 'fail',
    label: 'לקוי',
    icon: 'x',
    selectedBackground: COLORS.danger[50],
    selectedBorder: COLORS.danger[500],
    selectedText: COLORS.danger[700],
    selectedIcon: COLORS.danger[500],
  },
  {
    value: 'na',
    label: 'לא רלוונטי',
    icon: 'minus',
    selectedBackground: COLORS.neutral[100],
    selectedBorder: COLORS.neutral[300],
    selectedText: COLORS.neutral[500],
    selectedIcon: COLORS.neutral[400],
  },
];

// --- Animated Pill ---

function AnimatedPill({
  option,
  isSelected,
  onPress,
}: {
  option: StatusOption;
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }

    // Bounce animation
    scale.value = withSequence(
      withTiming(0.92, { duration: 80 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        className="flex-row items-center rounded-full px-[14px] py-[6px]"
        style={{
          backgroundColor: isSelected
            ? option.selectedBackground
            : COLORS.cream[100],
          borderWidth: 1.5,
          borderColor: isSelected ? option.selectedBorder : COLORS.cream[300],
        }}
      >
        <Feather
          name={option.icon}
          size={14}
          color={isSelected ? option.selectedIcon : COLORS.neutral[400]}
        />
        <Text
          className="text-[13px] font-rubik-medium me-[4px]"
          style={{
            color: isSelected ? option.selectedText : COLORS.neutral[500],
          }}
        >
          {option.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// --- StatusPills ---

interface StatusPillsProps {
  value?: ChecklistResultValue;
  onChange: (value: ChecklistResultValue) => void;
}

export function StatusPills({ value, onChange }: StatusPillsProps) {
  return (
    <View className="flex-row gap-[8px]">
      {STATUS_OPTIONS.map((option) => (
        <AnimatedPill
          key={option.value}
          option={option}
          isSelected={value === option.value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}
