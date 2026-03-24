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
import type { DefectSeverity } from '@docfield/shared';

interface SeverityOption {
  value: DefectSeverity;
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  selectedBackground: string;
  selectedBorder: string;
  selectedText: string;
  selectedIcon: string;
}

const SEVERITY_OPTIONS: SeverityOption[] = [
  {
    value: 'critical',
    label: 'חמור',
    icon: 'alert-circle',
    selectedBackground: COLORS.danger[50],
    selectedBorder: COLORS.danger[500],
    selectedText: COLORS.danger[700],
    selectedIcon: COLORS.danger[500],
  },
  {
    value: 'medium',
    label: 'בינוני',
    icon: 'alert-triangle',
    selectedBackground: COLORS.warning[50],
    selectedBorder: COLORS.warning[500],
    selectedText: COLORS.warning[700],
    selectedIcon: COLORS.warning[500],
  },
  {
    value: 'low',
    label: 'קל',
    icon: 'info',
    selectedBackground: COLORS.info[50],
    selectedBorder: COLORS.info[500],
    selectedText: COLORS.info[700],
    selectedIcon: COLORS.info[500],
  },
];

function AnimatedSeverityPill({
  option,
  isSelected,
  onPress,
}: {
  option: SeverityOption;
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
    scale.value = withSequence(
      withTiming(0.92, { duration: 80 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    onPress();
  };

  return (
    <Animated.View style={animatedStyle} className="flex-1">
      <Pressable
        onPress={handlePress}
        className="flex-row items-center justify-center rounded-full py-[8px]"
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

interface SeverityPillsProps {
  value?: DefectSeverity;
  onChange: (value: DefectSeverity) => void;
}

export function SeverityPills({ value, onChange }: SeverityPillsProps) {
  return (
    <View className="flex-row gap-[8px]">
      {SEVERITY_OPTIONS.map((option) => (
        <AnimatedSeverityPill
          key={option.value}
          option={option}
          isSelected={value === option.value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}
