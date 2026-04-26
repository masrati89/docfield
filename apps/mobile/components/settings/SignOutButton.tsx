import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  FadeInUp,
  FadeInDown,
  FadeOutDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from '@/lib/haptics';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

import { COLORS } from '@infield/ui';

// --- Types ---

interface SignOutButtonProps {
  onSignOut: () => Promise<void>;
  onError: (message: string) => void;
}

// --- Component ---

export function SignOutButton({ onSignOut, onError }: SignOutButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleSignOutPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowConfirm(true);
  }, []);

  const handleConfirmSignOut = useCallback(async () => {
    setShowConfirm(false);
    setIsSigningOut(true);

    try {
      await onSignOut();
      router.replace('/(auth)/login');
    } catch {
      onError('אירעה שגיאה בהתנתקות. נסה שוב');
    } finally {
      setIsSigningOut(false);
    }
  }, [onSignOut, onError]);

  return (
    <>
      <Animated.View
        entering={FadeInUp.delay(400).duration(400)}
        className="mx-[20px] mb-[40px]"
      >
        <Animated.View style={buttonStyle}>
          <Pressable
            onPress={handleSignOutPress}
            onPressIn={() => {
              buttonScale.value = withSpring(0.98, {
                damping: 15,
                stiffness: 150,
              });
            }}
            onPressOut={() => {
              buttonScale.value = withSpring(1, {
                damping: 15,
                stiffness: 150,
              });
            }}
            disabled={isSigningOut}
            className={`bg-danger-50 border border-danger-500 h-[52px] rounded-[14px] flex-row items-center justify-center gap-[8px] ${isSigningOut ? 'opacity-50' : ''}`}
          >
            {isSigningOut ? (
              <ActivityIndicator size="small" color={COLORS.danger[700]} />
            ) : (
              <>
                <Feather name="log-out" size={20} color={COLORS.danger[700]} />
                <Text className="text-[15px] font-rubik-semibold text-danger-700">
                  התנתקות
                </Text>
              </>
            )}
          </Pressable>
        </Animated.View>
      </Animated.View>

      {/* Confirmation Dialog */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="none"
        onRequestClose={() => setShowConfirm(false)}
      >
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: 'rgba(60,54,42,0.4)' }}
        >
          <Pressable
            onPress={() => setShowConfirm(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <Animated.View
            entering={FadeInDown.duration(300).springify()}
            exiting={FadeOutDown.duration(220)}
            style={{ backgroundColor: COLORS.cream[50] }}
            className="mx-[32px] w-[85%] max-w-[340px] rounded-[12px] p-[24px]"
          >
            <Text className="text-[18px] font-rubik-semibold text-neutral-800 text-right mb-[8px]">
              התנתקות
            </Text>
            <Text className="text-[15px] font-rubik text-neutral-600 text-right mb-[24px]">
              האם אתה בטוח שברצונך להתנתק?
            </Text>

            <View className="flex-row gap-[12px]">
              {/* Cancel (right = primary position in RTL) */}
              <Pressable
                onPress={() => setShowConfirm(false)}
                className="flex-1 h-[44px] rounded-[10px] items-center justify-center border border-cream-300 bg-cream-100"
              >
                <Text className="text-[14px] font-rubik-medium text-neutral-700">
                  ביטול
                </Text>
              </Pressable>

              {/* Confirm sign out */}
              <Pressable
                onPress={handleConfirmSignOut}
                style={{ backgroundColor: COLORS.danger[700] }}
                className="flex-1 h-[44px] rounded-[10px] items-center justify-center"
              >
                <Text className="text-[14px] font-rubik-semibold text-white">
                  התנתק
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}
