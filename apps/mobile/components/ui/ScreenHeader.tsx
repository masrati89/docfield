import { View, Text, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
}

export function ScreenHeader({ title, showBack = false }: ScreenHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <View className="flex-row items-center px-[20px] pt-[12px] pb-[16px]">
      {showBack && (
        <Pressable
          onPress={handleBack}
          className="w-[44px] h-[44px] rounded-[10px] items-center justify-center active:bg-cream-100"
          hitSlop={8}
        >
          <Feather name="chevron-right" size={24} color={COLORS.neutral[700]} />
        </Pressable>
      )}
      <Text
        className="text-[24px] font-rubik-bold text-neutral-800 flex-1"
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}
