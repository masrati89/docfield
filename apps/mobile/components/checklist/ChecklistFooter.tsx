import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';

// --- Types ---

interface ChecklistFooterProps {
  onAddDefect: () => void;
  onCamera: () => void;
  onSearch: () => void;
}

// --- Component ---

export function ChecklistFooter({
  onAddDefect,
  onCamera,
  onSearch,
}: ChecklistFooterProps) {
  const insets = useSafeAreaInsets();

  const handlePress = (cb: () => void) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    cb();
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.cream[50],
        borderTopWidth: 1,
        borderTopColor: COLORS.cream[200],
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: Math.max(24, insets.bottom),
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        ...SHADOWS.lg,
      }}
    >
      {/* Add defect — primary */}
      <Pressable
        onPress={() => handlePress(onAddDefect)}
        style={{
          flex: 1,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: COLORS.primary[500],
          borderRadius: BORDER_RADIUS.md,
          height: 44,
        }}
      >
        <Feather name="plus" size={20} color="#FFFFFF" />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#FFFFFF',
            fontFamily: 'Rubik-SemiBold',
          }}
        >
          הוסף ליקוי
        </Text>
      </Pressable>

      {/* Camera */}
      <Pressable
        onPress={() => handlePress(onCamera)}
        style={{
          width: 44,
          height: 44,
          borderRadius: BORDER_RADIUS.md,
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          backgroundColor: COLORS.cream[50],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name="camera" size={20} color={COLORS.neutral[500]} />
      </Pressable>

      {/* Search */}
      <Pressable
        onPress={() => handlePress(onSearch)}
        style={{
          width: 44,
          height: 44,
          borderRadius: BORDER_RADIUS.md,
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          backgroundColor: COLORS.cream[50],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name="search" size={20} color={COLORS.neutral[500]} />
      </Pressable>
    </View>
  );
}
