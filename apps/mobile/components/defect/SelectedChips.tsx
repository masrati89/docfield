import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';
import { COLORS } from '@infield/ui';
import Animated, {
  FadeInDown,
  FadeOutUp,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface SelectedChipsProps {
  items: string[];
  onRemove: (item: string) => void;
  color?: 'green' | 'blue';
  prefix?: string;
}

type ChipColor = 'green' | 'blue';

function getColorScheme(color: ChipColor) {
  switch (color) {
    case 'blue':
      return {
        bg: COLORS.primary[50],
        border: COLORS.primary[200],
        text: COLORS.primary[700],
        icon: COLORS.primary[600],
      };
    case 'green':
    default:
      return {
        bg: COLORS.primary[50],
        border: COLORS.primary[200],
        text: COLORS.primary[700],
        icon: COLORS.primary[600],
      };
  }
}

function Chip({
  label,
  onRemove,
  color = 'green',
  prefix,
}: {
  label: string;
  onRemove: () => void;
  color: ChipColor;
  prefix?: string;
}) {
  const scale = useSharedValue(1);
  const scheme = getColorScheme(color);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onRemove();
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(150)}
      exiting={FadeOutUp.duration(150)}
      style={animatedStyle}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 16,
          backgroundColor: scheme.bg,
          borderWidth: 1,
          borderColor: scheme.border,
        }}
      >
        <Feather name="x" size={14} color={scheme.icon} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Rubik-Medium',
            color: scheme.text,
          }}
        >
          {prefix}
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function SelectedChips({
  items,
  onRemove,
  color = 'green',
  prefix,
}: SelectedChipsProps) {
  if (items.length === 0) return null;

  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
      }}
    >
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          onRemove={() => onRemove(item)}
          color={color}
          prefix={prefix}
        />
      ))}
    </View>
  );
}
