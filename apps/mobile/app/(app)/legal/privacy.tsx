import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@infield/ui';
import { PrivacyPolicy } from '@/components/legal';
import { PressableScale } from '@/components/ui';
import { Feather } from '@expo/vector-icons';

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream[50] }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: COLORS.primary[700],
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <PressableScale
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.12)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="chevron-right" size={18} color="#fff" />
        </PressableScale>
      </View>

      {/* Content */}
      <PrivacyPolicy />
    </View>
  );
}
