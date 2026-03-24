import { useCallback, useRef, useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';

interface DefectCameraProps {
  onPhotoTaken: (uri: string) => void;
  onClose: () => void;
}

export function DefectCamera({ onPhotoTaken, onClose }: DefectCameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Capture button animation
  const captureScale = useSharedValue(1);
  const captureStyle = useAnimatedStyle(() => ({
    transform: [{ scale: captureScale.value }],
  }));

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    captureScale.value = withSequence(
      withTiming(0.85, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 150 })
    );

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (photo?.uri) {
        setCapturedUri(photo.uri);
      }
    } catch {
      // Camera might not be ready
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, captureScale]);

  const handleUsePhoto = useCallback(() => {
    if (!capturedUri) return;

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onPhotoTaken(capturedUri);
  }, [capturedUri, onPhotoTaken]);

  const handleRetake = useCallback(() => {
    setCapturedUri(null);
  }, []);

  const handleClose = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  }, [onClose]);

  const toggleFlash = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setFlashEnabled((previous) => !previous);
  }, []);

  // Permission not yet determined
  if (!permission) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-[15px] font-rubik">
          בודק הרשאת מצלמה...
        </Text>
      </View>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50 items-center justify-center px-[32px]">
        <View className="w-[80px] h-[80px] rounded-full bg-cream-100 items-center justify-center mb-[16px]">
          <Feather name="camera-off" size={32} color={COLORS.neutral[300]} />
        </View>
        <Text className="text-[17px] font-rubik-semibold text-neutral-700 mb-[8px] text-center">
          נדרשת הרשאת מצלמה
        </Text>
        <Text className="text-[15px] font-rubik text-neutral-500 text-center mb-[20px]">
          כדי לצלם ליקויים, יש לאפשר גישה למצלמה
        </Text>
        <Pressable
          onPress={requestPermission}
          className="h-[48px] px-[24px] rounded-[14px] bg-primary-500 items-center justify-center active:bg-primary-600"
        >
          <Text className="text-[15px] font-rubik-semibold text-white">
            אפשר גישה
          </Text>
        </Pressable>
        <Pressable
          onPress={onClose}
          className="mt-[12px] h-[44px] px-[24px] items-center justify-center"
        >
          <Text className="text-[15px] font-rubik text-neutral-500">חזור</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Preview mode — photo was taken
  if (capturedUri) {
    return (
      <View className="flex-1 bg-black">
        <Animated.View
          entering={FadeIn.duration(200)}
          style={styles.fullScreen}
        >
          <Image
            source={{ uri: capturedUri }}
            style={styles.fullScreen}
            contentFit="contain"
          />
        </Animated.View>

        {/* Bottom actions */}
        <SafeAreaView
          edges={['bottom']}
          className="absolute bottom-0 left-0 right-0"
        >
          <View className="flex-row items-center justify-around px-[20px] pb-[24px] pt-[16px]">
            <Pressable
              onPress={handleRetake}
              className="h-[48px] px-[24px] rounded-[14px] items-center justify-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <View className="flex-row items-center">
                <Feather name="refresh-cw" size={16} color="#FFFFFF" />
                <Text className="text-[15px] font-rubik-medium text-white me-[6px]">
                  צלם שוב
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleUsePhoto}
              className="h-[48px] px-[24px] rounded-[14px] bg-primary-500 items-center justify-center active:bg-primary-600"
            >
              <View className="flex-row items-center">
                <Feather name="check" size={16} color="#FFFFFF" />
                <Text className="text-[15px] font-rubik-semibold text-white me-[6px]">
                  השתמש
                </Text>
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Camera mode
  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={styles.fullScreen}
        facing="back"
        flash={flashEnabled ? 'on' : 'off'}
      />

      {/* Top controls */}
      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0">
        <View className="flex-row items-center justify-between px-[16px] pt-[8px]">
          {/* Close */}
          <Pressable
            onPress={handleClose}
            className="w-[44px] h-[44px] rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          >
            <Feather name="x" size={22} color="#FFFFFF" />
          </Pressable>

          {/* Flash */}
          <Pressable
            onPress={toggleFlash}
            className="w-[44px] h-[44px] rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          >
            <Feather
              name={flashEnabled ? 'zap' : 'zap-off'}
              size={20}
              color={flashEnabled ? COLORS.gold[300] : '#FFFFFF'}
            />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Capture button */}
      <SafeAreaView
        edges={['bottom']}
        className="absolute bottom-0 left-0 right-0"
      >
        <View className="items-center pb-[32px]">
          <Animated.View style={captureStyle}>
            <Pressable
              onPress={handleCapture}
              disabled={isCapturing}
              className="w-[70px] h-[70px] rounded-full items-center justify-center"
              style={{
                backgroundColor: '#FFFFFF',
                borderWidth: 4,
                borderColor: COLORS.cream[300],
                opacity: isCapturing ? 0.5 : 1,
              }}
            >
              <View
                className="w-[56px] h-[56px] rounded-full"
                style={{ backgroundColor: '#FFFFFF' }}
              />
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
