import { useCallback, useEffect, useState } from 'react';
import { I18nManager, View, Text, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { COLORS } from '@infield/ui';
import { AuthProvider } from '@/contexts/AuthContext';

import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// RTL — mandatory for Israeli market
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

SplashScreen.preventAutoHideAsync();

// --- Animated Splash Overlay ---

function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    // Fade in + scale up
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    logoScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    // Pulse effect
    logoScale.value = withSequence(
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
      withRepeat(
        withSequence(
          withTiming(1.05, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        2,
        true
      )
    );

    // Fade out after animation
    const timeout = setTimeout(() => {
      overlayOpacity.value = withTiming(0, { duration: 400 }, () => {
        runOnJS(onFinish)();
      });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [logoOpacity, logoScale, overlayOpacity, onFinish]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <Animated.View
      style={[styles.splashOverlay, overlayStyle]}
      pointerEvents="none"
    >
      <Animated.View style={[styles.splashLogoContainer, logoStyle]}>
        <View style={styles.splashIcon}>
          <Text style={styles.splashIconText}>iF</Text>
        </View>
        <Text style={styles.splashTitle}>inField</Text>
        <Text style={styles.splashSubtitle}>ביקורת בנייה חכמה</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.cream[50],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  splashLogoContainer: {
    alignItems: 'center',
  },
  splashIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: COLORS.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  splashIconText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primary[700],
  },
  splashSubtitle: {
    fontSize: 15,
    color: COLORS.neutral[500],
    marginTop: 8,
  },
});

// --- Root Layout ---

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  /* eslint-disable @typescript-eslint/no-require-imports */
  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('../assets/fonts/Rubik-Regular.ttf'),
    'Rubik-Medium': require('../assets/fonts/Rubik-Medium.ttf'),
    'Rubik-SemiBold': require('../assets/fonts/Rubik-SemiBold.ttf'),
    'Rubik-Bold': require('../assets/fonts/Rubik-Bold.ttf'),
    'Inter-Regular': require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
    'Inter-SemiBold': require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
    'Inter-Bold': require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
  });
  /* eslint-enable @typescript-eslint/no-require-imports */

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const handleSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <View style={{ flex: 1 }}>
            <Slot />
            {!splashDone && <AnimatedSplash onFinish={handleSplashFinish} />}
          </View>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
