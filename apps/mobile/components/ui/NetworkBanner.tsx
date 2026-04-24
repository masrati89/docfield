import { useNetInfo } from '@react-native-community/netinfo';
import { Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

export function NetworkBanner() {
  const { isConnected } = useNetInfo();

  if (isConnected !== false) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(200)}
      style={styles.banner}
    >
      <Text style={styles.text}>אין חיבור לאינטרנט</Text>
      <Feather name="wifi-off" size={16} color={COLORS.white} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.warning[500],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.sm,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    fontFamily: 'Rubik-Medium',
    color: COLORS.white,
    textAlign: 'center',
  },
});
