import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

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
    iconColor: COLORS.primary[500],
    bg: COLORS.primary[50],
  },
  {
    label: 'חיפוש',
    icon: 'search',
    iconColor: COLORS.primary[500],
    bg: COLORS.primary[50],
  },
  {
    label: 'תבניות',
    icon: 'clipboard',
    iconColor: COLORS.primary[600],
    bg: COLORS.primary[50],
  },
  {
    label: 'עזרה',
    icon: 'help-circle',
    iconColor: COLORS.neutral[500],
    bg: COLORS.cream[100],
  },
];

// --- Tool Cell ---

function ToolCell({ tool, onPress }: { tool: ToolItem; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: pressed ? COLORS.cream[100] : COLORS.cream[50],
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        borderRadius: BORDER_RADIUS.lg,
        padding: 12,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 10,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: BORDER_RADIUS.md,
          backgroundColor: tool.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name={tool.icon} size={20} color={tool.iconColor} />
      </View>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '500',
          color: COLORS.neutral[700],
          fontFamily: 'Rubik-Medium',
          flex: 1,
          textAlign: 'right',
        }}
      >
        {tool.label}
      </Text>
    </Pressable>
  );
}

// --- Component ---

interface ToolGridProps {
  onToolPress?: (label: string) => void;
}

export function ToolGrid({ onToolPress }: ToolGridProps) {
  const handleToolPress = (label: string) => {
    onToolPress?.(label);
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(300).duration(400)}
      style={{ marginHorizontal: 16, marginTop: 12 }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: COLORS.neutral[800],
          fontFamily: 'Rubik-Bold',
          textAlign: 'right',
          marginBottom: 8,
          paddingRight: 2,
        }}
      >
        כלים
      </Text>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
          <ToolCell
            tool={TOOLS[0]}
            onPress={() => handleToolPress(TOOLS[0].label)}
          />
          <ToolCell
            tool={TOOLS[1]}
            onPress={() => handleToolPress(TOOLS[1].label)}
          />
        </View>
        <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
          <ToolCell
            tool={TOOLS[2]}
            onPress={() => handleToolPress(TOOLS[2].label)}
          />
          <ToolCell
            tool={TOOLS[3]}
            onPress={() => handleToolPress(TOOLS[3].label)}
          />
        </View>
      </View>
    </Animated.View>
  );
}
