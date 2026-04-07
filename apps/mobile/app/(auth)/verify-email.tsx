import { useCallback, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import { supabase } from '@/lib/supabase';

export default function VerifyEmailScreen() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = useCallback(async () => {
    setResending(true);
    setError('');
    setResent(false);

    try {
      if (!emailParam) {
        setError('לא נמצא אימייל. נסה להירשם שוב.');
        return;
      }

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: emailParam,
      });

      if (resendError) {
        setError('שגיאה בשליחת מייל האימות. נסה שוב.');
      } else {
        setResent(true);
      }
    } catch {
      setError('בעיית תקשורת. בדוק את החיבור לאינטרנט.');
    } finally {
      setResending(false);
    }
  }, [emailParam]);

  const handleGoToLogin = useCallback(() => {
    supabase.auth.signOut();
    router.replace('/(auth)/login');
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />

      <View className="flex-1 items-center justify-center px-[20px]">
        <Animated.View
          entering={FadeInUp.duration(600).springify()}
          className="items-center"
        >
          {/* Email icon */}
          <View
            className="w-[80px] h-[80px] rounded-full items-center justify-center mb-[24px]"
            style={{ backgroundColor: COLORS.primary[50] }}
          >
            <Feather name="mail" size={40} color={COLORS.primary[500]} />
          </View>

          <Text className="text-[24px] font-rubik-bold text-neutral-800 text-center mb-[12px]">
            בדוק את תיבת הדואר
          </Text>

          <Text className="text-[15px] font-rubik text-neutral-500 text-center mb-[32px] leading-[22px]">
            שלחנו לך מייל אימות.{'\n'}בדוק את תיבת הדואר שלך ולחץ על הקישור
            לאימות.
          </Text>

          {/* Resend button */}
          <Pressable
            onPress={handleResend}
            disabled={resending}
            className={`
              w-full h-[50px] rounded-[12px] items-center justify-center mb-[12px]
              border-[1.5px] border-primary-500
              ${resending ? 'opacity-50' : ''}
            `}
          >
            {resending ? (
              <ActivityIndicator size="small" color={COLORS.primary[500]} />
            ) : (
              <Text className="text-[15px] font-rubik-semibold text-primary-500">
                שלח שוב
              </Text>
            )}
          </Pressable>

          {/* Success message */}
          {resent && (
            <Animated.View
              entering={FadeInUp.duration(200)}
              className="flex-row-reverse items-center mb-[8px]"
            >
              <Feather
                name="check-circle"
                size={16}
                color={COLORS.primary[500]}
              />
              <Text className="text-[13px] font-rubik text-primary-500 me-[4px]">
                מייל אימות נשלח בהצלחה
              </Text>
            </Animated.View>
          )}

          {/* Error message */}
          {error && (
            <Animated.View
              entering={FadeInUp.duration(200)}
              className="flex-row-reverse items-center mb-[8px]"
            >
              <Feather
                name="alert-circle"
                size={16}
                color={COLORS.danger[500]}
              />
              <Text className="text-[13px] font-rubik text-danger-500 me-[4px]">
                {error}
              </Text>
            </Animated.View>
          )}

          {/* Go to login */}
          <Pressable onPress={handleGoToLogin} className="mt-[16px]">
            <Text className="text-[15px] font-rubik text-neutral-500 text-center">
              אימתת את המייל?{' '}
              <Text className="text-primary-500 font-rubik-medium">התחבר</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
