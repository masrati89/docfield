import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';

// --- Types ---

interface HomeHeaderProps {
  userName: string;
  onNewInspection?: () => void;
}

// --- Component ---

export function HomeHeader({ userName, onNewInspection }: HomeHeaderProps) {
  const handleNewInspection = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onNewInspection?.();
  };

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
      {/* Greeting + CTA row — RTL */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          marginTop: 14,
        }}
      >
        {/* Greeting — right in RTL */}
        <View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Rubik-Bold',
              color: COLORS.neutral[800],
              textAlign: 'right',
            }}
          >
            {`שלום, ${userName}`}
          </Text>
          {/* Sync indicator — hidden until offline sync is implemented */}
        </View>

        <View style={{ flex: 1 }} />

        {/* CTA button — left in RTL */}
        <Pressable
          onPress={handleNewInspection}
          style={{
            height: 34,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS.primary[500],
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 5,
            paddingHorizontal: 14,
            ...SHADOWS.sm,
          }}
        >
          <Feather name="plus" size={16} color={COLORS.white} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              fontFamily: 'Rubik-SemiBold',
              color: COLORS.white,
            }}
          >
            בדיקה חדשה
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
