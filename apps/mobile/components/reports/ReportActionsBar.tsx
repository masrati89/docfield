import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import { PressableScale } from '@/components/ui';

interface ReportActionsBarProps {
  bottomInset: number;
  onAddDefect: () => void;
  onSearch?: () => void;
}

export function ReportActionsBar({
  bottomInset,
  onAddDefect,
  onSearch,
}: ReportActionsBarProps) {
  console.warn('[ReportActionsBar] rendered with callbacks:', {
    onAddDefect: !!onAddDefect,
    onSearch: !!onSearch,
  });
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
        paddingBottom: Math.max(bottomInset, 22),
        flexDirection: 'row-reverse',
        gap: 10,
        boxShadow: '0 -4px 20px rgba(60,54,42,.12)',
        pointerEvents: 'auto',
        zIndex: 100,
      }}
    >
      {/* Search button */}
      <PressableScale
        testID="report-actions-search"
        onPress={onSearch}
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 2px rgba(60,54,42,.05)',
        }}
      >
        <Feather name="search" size={20} color={COLORS.neutral[700]} />
      </PressableScale>

      {/* Add defect button */}
      <PressableScale
        testID="report-actions-add-defect"
        onPress={onAddDefect}
        scale={0.96}
        style={{
          flex: 1,
          height: 48,
          borderRadius: 12,
          backgroundColor: COLORS.primary[500],
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 2px 10px rgba(27,122,68,.26)',
        }}
      >
        <Feather name="plus" size={20} color="#fff" />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#fff',
            fontFamily: 'Rubik-SemiBold',
          }}
        >
          הוסף ממצא
        </Text>
      </PressableScale>
    </View>
  );
}
