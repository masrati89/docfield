import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS, SHADOWS } from '@infield/ui';
import { PressableScale } from '@/components/ui';

interface ActionCardProps {
  onPress?: () => void;
}

export function ActionCard({ onPress }: ActionCardProps) {
  return (
    <Animated.View entering={FadeInDown.delay(150).duration(400)}>
      <PressableScale
        onPress={onPress}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 12,
          padding: 14,
          backgroundColor: '#fff',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          ...SHADOWS.sm,
        }}
      >
        {/* Text */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: COLORS.neutral[800],
              fontFamily: 'Rubik-Bold',
              textAlign: 'right',
              letterSpacing: -0.2,
            }}
          >
            בדיקה חדשה
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: COLORS.neutral[500],
              fontFamily: 'Rubik-Regular',
              textAlign: 'right',
              marginTop: 2,
            }}
          >
            פתח טופס מסירה או בדק בית
          </Text>
        </View>

        {/* CTA button */}
        <View
          style={{
            height: 38,
            borderRadius: 10,
            backgroundColor: COLORS.primary[500],
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: 'rgba(27,122,68,1)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.24,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#fff',
              fontFamily: 'Rubik-SemiBold',
            }}
          >
            התחל
          </Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
}
