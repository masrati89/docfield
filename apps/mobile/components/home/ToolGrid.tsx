import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { PressableScale } from '@/components/ui';

// --- Types ---

interface ToolItem {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  bg: string;
}

const TOOLS: ToolItem[] = [
  {
    label: 'מאגר ממצאים',
    icon: 'database',
    iconColor: COLORS.primary[600],
    bg: COLORS.primary[50],
  },
  {
    label: 'חיפוש',
    icon: 'search',
    iconColor: COLORS.primary[600],
    bg: COLORS.primary[50],
  },
  {
    label: 'תבניות',
    icon: 'clipboard',
    iconColor: COLORS.gold[700],
    bg: COLORS.gold[100],
  },
  {
    label: 'עזרה',
    icon: 'help-circle',
    iconColor: COLORS.neutral[600],
    bg: COLORS.cream[100],
  },
];

// --- Tool Cell ---

function ToolCell({ tool, onPress }: { tool: ToolItem; onPress?: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: tool.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name={tool.icon} size={19} color={tool.iconColor} />
      </View>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: COLORS.neutral[700],
          fontFamily: 'Rubik-SemiBold',
          flex: 1,
          textAlign: 'right',
        }}
      >
        {tool.label}
      </Text>
    </PressableScale>
  );
}

// --- Component ---

interface ToolGridProps {
  onToolPress?: (label: string) => void;
}

export function ToolGrid({ onToolPress }: ToolGridProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(300).duration(400)}
      style={{ marginTop: 14 }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: COLORS.neutral[800],
          fontFamily: 'Rubik-Bold',
          textAlign: 'right',
          marginBottom: 10,
          paddingRight: 2,
          letterSpacing: -0.2,
        }}
      >
        כלים מהירים
      </Text>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
          <ToolCell
            tool={TOOLS[0]}
            onPress={() => onToolPress?.(TOOLS[0].label)}
          />
          <ToolCell
            tool={TOOLS[1]}
            onPress={() => onToolPress?.(TOOLS[1].label)}
          />
        </View>
        <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
          <ToolCell
            tool={TOOLS[2]}
            onPress={() => onToolPress?.(TOOLS[2].label)}
          />
          <ToolCell
            tool={TOOLS[3]}
            onPress={() => onToolPress?.(TOOLS[3].label)}
          />
        </View>
      </View>
    </Animated.View>
  );
}
