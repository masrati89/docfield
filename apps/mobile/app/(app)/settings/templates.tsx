import { useCallback } from 'react';
import { Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { PressableScale } from '@/components/ui';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { TemplatesSection } from '@/components/settings';

export default function TemplatesScreen() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();

  const handleSuccess = useCallback(
    (message: string) => {
      showToast(message, 'success');
    },
    [showToast]
  );

  const handleError = useCallback(
    (message: string) => {
      showToast(message, 'error');
    },
    [showToast]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream[50] }}>
      <StatusBar style="dark" />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onDismiss={hideToast}
        />
      )}

      {/* Header */}
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          gap: 12,
        }}
      >
        <PressableScale onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={COLORS.neutral[700]} />
        </PressableScale>
        <Text
          style={{
            fontSize: 22,
            fontFamily: 'Rubik-Bold',
            color: COLORS.neutral[800],
            flex: 1,
            textAlign: 'right',
          }}
        >
          ניהול תבניות
        </Text>
        <Feather name="clipboard" size={22} color={COLORS.gold[600]} />
      </Animated.View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 88,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <TemplatesSection onSuccess={handleSuccess} onError={handleError} />
      </ScrollView>
    </SafeAreaView>
  );
}
