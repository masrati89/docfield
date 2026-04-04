import { Feather } from '@expo/vector-icons';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { AnimatedPressable, haptic } from './projectsConstants';

export function FAB({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        haptic();
        onPress();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 15, stiffness: 150 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      }}
      style={[
        {
          position: 'absolute',
          bottom: 16,
          left: 16,
          width: 48,
          height: 48,
          borderRadius: 14,
          backgroundColor: COLORS.primary[500],
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#1B7A44',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
        },
        animStyle,
      ]}
    >
      <Feather name="folder-plus" size={20} color={COLORS.white} />
    </AnimatedPressable>
  );
}
