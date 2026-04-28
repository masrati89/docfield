import { useMemo } from 'react';
import { View, Text, Pressable, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';
import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface DropdownBaseProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  selectedCount?: number;
  children: React.ReactNode;
  loading?: boolean;
  maxHeight?: number;
}

export function DropdownBase({
  label,
  isOpen,
  onToggle,
  selectedCount = 0,
  children,
  loading = false,
  maxHeight = 300,
}: DropdownBaseProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onToggle();
  };

  const displayLabel = useMemo(() => {
    if (selectedCount > 0) {
      return `${label} (${selectedCount})`;
    }
    return label;
  }, [label, selectedCount]);

  return (
    <View style={{ flex: 1 }}>
      {/* Dropdown Header/Button */}
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: isOpen ? COLORS.primary[300] : COLORS.cream[200],
            backgroundColor: isOpen ? COLORS.primary[50] : COLORS.cream[100],
            ...SHADOWS.sm,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-Medium',
              color: isOpen ? COLORS.primary[700] : COLORS.neutral[700],
              flex: 1,
              textAlign: 'right',
            }}
          >
            {displayLabel}
          </Text>

          <Feather
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={isOpen ? COLORS.primary[500] : COLORS.neutral[500]}
            style={{ marginStart: 6 }}
          />
        </Pressable>
      </Animated.View>

      {/* Dropdown Content */}
      {isOpen && (
        <View
          style={{
            marginTop: 8,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            backgroundColor: COLORS.white,
            overflow: 'hidden',
            ...SHADOWS.md,
            zIndex: 1000,
            maxHeight,
          }}
        >
          {loading ? (
            <View
              style={{
                paddingVertical: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[400],
                }}
              >
                טוען...
              </Text>
            </View>
          ) : (
            <ScrollView
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {children}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}
