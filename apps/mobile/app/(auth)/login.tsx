import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import { loginSchema } from '@infield/shared';

import { useAuth } from '@/contexts/AuthContext';

// --- Field error type ---

interface FieldErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginScreen() {
  const { signIn } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for focus management
  const passwordInputRef = useRef<TextInput>(null);

  // Button press animation
  const buttonScale = useSharedValue(1);
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Shake animation for errors
  const shakeX = useSharedValue(0);
  const shakeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const triggerShake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-4, { duration: 60 }),
      withTiming(4, { duration: 60 }),
      withTiming(-4, { duration: 60 }),
      withTiming(4, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  }, [shakeX]);

  // Validate single field on blur
  const validateField = useCallback(
    (field: 'email' | 'password') => {
      const value = field === 'email' ? email : password;

      if (!value.trim()) {
        setErrors((previous) => ({
          ...previous,
          [field]:
            field === 'email' ? 'נא להזין כתובת אימייל' : 'נא להזין סיסמה',
        }));
        return false;
      }

      // Field-specific validation
      const partialData =
        field === 'email'
          ? { email: value, password: 'placeholder' }
          : { email: 'placeholder@test.com', password: value };

      const result = loginSchema.safeParse(partialData);

      if (!result.success) {
        const fieldError = result.error.errors.find(
          (error) => error.path[0] === field
        );
        if (fieldError) {
          setErrors((previous) => ({
            ...previous,
            [field]: fieldError.message,
          }));
          return false;
        }
      }

      // Clear error for this field
      setErrors((previous) => {
        const next = { ...previous };
        delete next[field];
        return next;
      });
      return true;
    },
    [email, password]
  );

  // Handle submit
  const handleSubmit = useCallback(async () => {
    // Clear previous general error
    setErrors((previous) => {
      const next = { ...previous };
      delete next.general;
      return next;
    });

    // Validate all fields
    const result = loginSchema.safeParse({ email: email.trim(), password });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const error of result.error.errors) {
        const field = error.path[0] as keyof FieldErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = error.message;
        }
      }
      setErrors(fieldErrors);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      triggerShake();
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(email.trim(), password);

      if (error) {
        setErrors({ general: error });
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        triggerShake();
      } else {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, signIn, triggerShake]);

  // Button press handlers
  const handlePressIn = useCallback(() => {
    buttonScale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 150 });
  }, [buttonScale]);

  const handleButtonPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    handleSubmit();
  }, [handleSubmit]);

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-center px-[20px]">
            {/* Logo */}
            <Animated.View
              entering={FadeInUp.duration(600).springify()}
              className="items-center mb-[48px]"
            >
              <View className="w-[72px] h-[72px] rounded-xl bg-primary-700 items-center justify-center mb-[16px]">
                <Text className="text-white text-[28px] font-rubik-bold">
                  DF
                </Text>
              </View>
              <Text className="text-[32px] font-rubik-bold text-primary-700">
                inField
              </Text>
              <Text className="text-[15px] font-rubik text-neutral-500 mt-[8px]">
                התחבר לחשבון שלך
              </Text>
            </Animated.View>

            {/* Form */}
            <Animated.View
              entering={FadeInUp.delay(150).duration(500).springify()}
              className="w-full"
              style={shakeAnimatedStyle}
            >
              {/* General error */}
              {errors.general && (
                <Animated.View
                  entering={FadeInUp.duration(200)}
                  className="flex-row items-center bg-danger-50 border border-danger-500 rounded-[10px] px-[14px] py-[12px] mb-[16px]"
                >
                  <Feather
                    name="alert-circle"
                    size={18}
                    color={COLORS.danger[500]}
                  />
                  <Text className="text-[13px] font-rubik text-danger-700 me-[8px] flex-1">
                    {errors.general}
                  </Text>
                </Animated.View>
              )}

              {/* Email field */}
              <View className="mb-[16px]">
                <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                  אימייל
                </Text>
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors((previous) => {
                        const next = { ...previous };
                        delete next.email;
                        return next;
                      });
                    }
                  }}
                  onBlur={() => validateField('email')}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  placeholder="name@example.com"
                  placeholderTextColor={COLORS.neutral[400]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  editable={!isSubmitting}
                  className={`
                    h-[50px] rounded-[10px] px-[16px]
                    text-[16px] font-rubik text-neutral-700
                    bg-cream-50
                    ${
                      errors.email
                        ? 'border-[1.5px] border-danger-500'
                        : 'border-[1.5px] border-cream-300'
                    }
                    ${isSubmitting ? 'opacity-50' : ''}
                  `}
                  style={{ textAlign: 'right', writingDirection: 'ltr' }}
                />
                {errors.email && (
                  <Animated.View
                    entering={FadeInUp.duration(200)}
                    className="flex-row items-center mt-[4px]"
                  >
                    <Feather
                      name="alert-circle"
                      size={14}
                      color={COLORS.danger[700]}
                    />
                    <Text className="text-[13px] font-rubik text-danger-700 me-[4px]">
                      {errors.email}
                    </Text>
                  </Animated.View>
                )}
              </View>

              {/* Password field */}
              <View className="mb-[24px]">
                <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                  סיסמה
                </Text>
                <View className="relative">
                  <TextInput
                    ref={passwordInputRef}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) {
                        setErrors((previous) => {
                          const next = { ...previous };
                          delete next.password;
                          return next;
                        });
                      }
                    }}
                    onBlur={() => validateField('password')}
                    onSubmitEditing={handleSubmit}
                    placeholder="לפחות 8 תווים"
                    placeholderTextColor={COLORS.neutral[400]}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="current-password"
                    textContentType="password"
                    returnKeyType="done"
                    editable={!isSubmitting}
                    className={`
                      h-[50px] rounded-[10px] px-[16px] pe-[48px]
                      text-[16px] font-rubik text-neutral-700
                      bg-cream-50
                      ${
                        errors.password
                          ? 'border-[1.5px] border-danger-500'
                          : 'border-[1.5px] border-cream-300'
                      }
                      ${isSubmitting ? 'opacity-50' : ''}
                    `}
                    style={{ textAlign: 'right', writingDirection: 'ltr' }}
                  />
                  {/* Show/hide password toggle */}
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute start-[12px] top-[13px] p-[2px]"
                    hitSlop={8}
                    accessibilityLabel={
                      showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'
                    }
                  >
                    {showPassword ? (
                      <Feather
                        name="eye-off"
                        size={20}
                        color={COLORS.neutral[400]}
                      />
                    ) : (
                      <Feather
                        name="eye"
                        size={20}
                        color={COLORS.neutral[400]}
                      />
                    )}
                  </Pressable>
                </View>
                {errors.password && (
                  <Animated.View
                    entering={FadeInUp.duration(200)}
                    className="flex-row items-center mt-[4px]"
                  >
                    <Feather
                      name="alert-circle"
                      size={14}
                      color={COLORS.danger[700]}
                    />
                    <Text className="text-[13px] font-rubik text-danger-700 me-[4px]">
                      {errors.password}
                    </Text>
                  </Animated.View>
                )}
              </View>

              {/* Submit button */}
              <Animated.View style={buttonAnimatedStyle}>
                <Pressable
                  onPress={handleButtonPress}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  disabled={isSubmitting}
                  className={`
                    bg-primary-500 h-[52px] rounded-[14px]
                    items-center justify-center
                    active:bg-primary-600
                    ${isSubmitting ? 'opacity-50' : ''}
                  `}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-white text-[15px] font-rubik-semibold">
                      התחבר
                    </Text>
                  )}
                </Pressable>
              </Animated.View>
            </Animated.View>

            {/* Register link */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(400).springify()}
              className="mt-[24px]"
            >
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text className="text-[15px] font-rubik text-neutral-500 text-center">
                    אין לך חשבון?{' '}
                    <Text className="text-primary-500 font-rubik-medium">
                      צור חשבון חדש
                    </Text>
                  </Text>
                </Pressable>
              </Link>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
