import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';

// --- Types ---

interface CompletionItem {
  label: string;
  completed: boolean;
}

interface CompletionIndicatorProps {
  items: CompletionItem[];
}

// --- Component ---

export function CompletionIndicator({ items }: CompletionIndicatorProps) {
  const completedCount = items.filter((i) => i.completed).length;
  const total = items.length;
  const ratio = total > 0 ? completedCount / total : 0;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={{
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 16,
        backgroundColor: COLORS.cream[100],
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        borderRadius: 14,
      }}
    >
      {/* Title */}
      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Rubik-SemiBold',
          color: COLORS.neutral[800],
          textAlign: 'right',
          marginBottom: 12,
        }}
      >
        הפרופיל שלך
      </Text>

      {/* Items grid */}
      <View
        style={{
          flexDirection: 'row-reverse',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 12,
        }}
      >
        {items.map((item) => (
          <View
            key={item.label}
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: item.completed
                  ? COLORS.primary[500]
                  : COLORS.neutral[300],
              }}
            >
              {item.completed ? '\u25CF' : '\u25CB'}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[500],
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Progress bar */}
      <View
        style={{
          height: 4,
          backgroundColor: COLORS.cream[200],
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 6,
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${ratio * 100}%`,
            backgroundColor: COLORS.primary[500],
            borderRadius: 2,
          }}
        />
      </View>

      {/* Count label */}
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[500],
          textAlign: 'right',
        }}
      >
        {completedCount} מתוך {total} פריטים הושלמו
      </Text>
    </Animated.View>
  );
}
