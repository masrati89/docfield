import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@infield/ui';
import { PressableScale } from '@/components/ui';

// --- Types ---

interface ChecklistFooterProps {
  onAddDefect: () => void;
  onSearch: () => void;
}

// --- Component ---

export function ChecklistFooter({
  onAddDefect,
  onSearch,
}: ChecklistFooterProps) {
  const insets = useSafeAreaInsets();

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
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: Math.max(22, insets.bottom),
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 10,
        shadowColor: 'rgb(60,54,42)',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 12,
      }}
    >
      {/* Add defect — primary */}
      <PressableScale
        onPress={onAddDefect}
        style={{
          flex: 1,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: COLORS.primary[500],
          borderRadius: 12,
          height: 48,
          shadowColor: 'rgb(27,122,68)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.26,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <Feather name="plus" size={20} color={COLORS.white} />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: COLORS.white,
            fontFamily: 'Rubik-SemiBold',
          }}
        >
          הוסף ממצא
        </Text>
      </PressableScale>

      {/* Search */}
      <PressableScale
        onPress={onSearch}
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          backgroundColor: COLORS.white,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: 'rgb(60,54,42)',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Feather name="search" size={20} color={COLORS.neutral[700]} />
      </PressableScale>
    </View>
  );
}
