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
import { Link, router } from 'expo-router';
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
import { fullRegisterSchema } from '@infield/shared';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// --- Field error type ---

interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  orgName?: string;
  general?: string;
}

type FieldKey = keyof FieldErrors;

export default function RegisterScreen() {
  const { signUp } = useAuth();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for focus management
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const orgNameInputRef = useRef<TextInput>(null);

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

  // Clear a single field error
  const clearFieldError = useCallback((field: FieldKey) => {
    setErrors((previous) => {
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }, []);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    clearFieldError('general');

    // Validate all fields
    const result = fullRegisterSchema.safeParse({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      orgName: orgName.trim(),
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const error of result.error.errors) {
        const field = error.path[0] as FieldKey;
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
      // Step 1: Sign up the user via auth
      const { error: signUpError } = await signUp(
        email.trim(),
        password,
        fullName.trim()
      );

      if (signUpError) {
        setErrors({ general: signUpError });
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        triggerShake();
        return;
      }

      // Step 2: Get the newly created user
      const {
        data: { user: newUser },
      } = await supabase.auth.getUser();

      if (!newUser) {
        setErrors({ general: 'אירעה שגיאה ביצירת המשתמש. נסה שוב' });
        triggerShake();
        return;
      }

      // Step 3: Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: orgName.trim(),
          owner_id: newUser.id,
        })
        .select('id')
        .single();

      if (orgError) {
        await supabase.auth.signOut();
        setErrors({ general: 'אירעה שגיאה ביצירת הארגון. נסה שוב' });
        triggerShake();
        return;
      }

      // Step 4: Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: newUser.id,
        organization_id: orgData.id,
        email: email.trim(),
        full_name: fullName.trim(),
        role: 'admin',
        is_active: true,
      });

      if (profileError) {
        // Rollback: delete org and sign out
        await supabase.from('organizations').delete().eq('id', orgData.id);
        await supabase.auth.signOut();
        setErrors({ general: 'אירעה שגיאה ביצירת הפרופיל. נסה שוב' });
        triggerShake();
        return;
      }

      // Success
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.replace('/(app)');
    } catch {
      setErrors({ general: 'בעיית תקשורת. בדוק את החיבור לאינטרנט' });
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  }, [
    fullName,
    email,
    password,
    confirmPassword,
    orgName,
    signUp,
    triggerShake,
    clearFieldError,
  ]);

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
          <View className="flex-1 items-center justify-center px-[20px] py-[32px]">
            {/* Header */}
            <Animated.View
              entering={FadeInUp.duration(600).springify()}
              className="items-center mb-[32px]"
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
                צור חשבון חדש
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
                    size={20}
                    color={COLORS.danger[500]}
                  />
                  <Text className="text-[13px] font-rubik text-danger-700 me-[8px] flex-1">
                    {errors.general}
                  </Text>
                </Animated.View>
              )}

              {/* Full name */}
              <View className="mb-[16px]">
                <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                  שם מלא
                </Text>
                <TextInput
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) clearFieldError('fullName');
                  }}
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                  placeholder="ישראל ישראלי"
                  placeholderTextColor={COLORS.neutral[400]}
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  returnKeyType="next"
                  editable={!isSubmitting}
                  className={`
                    h-[50px] rounded-[10px] px-[16px]
                    text-[16px] font-rubik text-neutral-700
                    bg-cream-50
                    ${errors.fullName ? 'border-[1.5px] border-danger-500' : 'border-[1.5px] border-cream-300'}
                    ${isSubmitting ? 'opacity-50' : ''}
                  `}
                  style={{ textAlign: 'right', writingDirection: 'rtl' }}
                />
                {errors.fullName && (
                  <Animated.View
                    entering={FadeInUp.duration(200)}
                    className="flex-row items-center mt-[4px]"
                  >
                    <Feather
                      name="alert-circle"
                      size={16}
                      color={COLORS.danger[700]}
                    />
                    <Text className="text-[13px] font-rubik text-danger-700 me-[4px]">
                      {errors.fullName}
                    </Text>
                  </Animated.View>
                )}
              </View>

              {/* Email */}
              <View className="mb-[16px]">
                <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                  אימייל
                </Text>
                <TextInput
                  ref={emailInputRef}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) clearFieldError('email');
                  }}
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
                    ${errors.email ? 'border-[1.5px] border-danger-500' : 'border-[1.5px] border-cream-300'}
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
                      size={16}
                      color={COLORS.danger[700]}
                    />
                    <Text className="text-[13px] font-rubik text-danger-700 me-[4px]">
                      {errors.email}
                    </Text>
                  </Animated.View>
                )}
              </View>

              {/* Password */}
              <View className="mb-[16px]">
                <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                  סיסמה
                </Text>
                <View className="relative">
                  <TextInput
                    ref={passwordInputRef}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) clearFieldError('password');
                    }}
                    onSubmitEditing={() =>
                      confirmPasswordInputRef.current?.focus()
                    }
                    placeholder="לפחות 8 תווים"
                    placeholderTextColor={COLORS.neutral[400]}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    returnKeyType="next"
                    editable={!isSubmitting}
                    className={`
                      h-[50px] rounded-[10px] px-[16px] pe-[48px]
                      text-[16px] font-rubik text-neutral-700
                      bg-cream-50
                      ${errors.password ? 'border-[1.5px] border-danger-500' : 'border-[1.5px] border-cream-300'}
                      ${isSubmitting ? 'opacity-50' : ''}
                    `}
                    style={{ textAlign: 'right', writingDirection: 'ltr' }}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute start-[12px] top-[13px] p-[2px]"
                    hitSlop={8}
                    accessibilityLabel={
                      showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'
                    }
                  >
                    <Feather
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={COLORS.neutral[400]}
                    />
                  </Pressable>
                </View>
                {errors.password && (
                  <Animated.View
                    entering={FadeInUp.duration(200)}
                    className="flex-row items-center mt-[4px]"
                  >
                    <Feather
                      name="alert-circle"
                      size={16}
                      color={COLORS.danger[700]}
                    />
                    <Text className="text-[13px] font-rubik text-danger-700 me-[4px]">
                      {errors.password}
                    </Text>
                  </Animated.View>
                )}
              </View>

              {/* Confirm password */}
              <View className="mb-[16px]">
                <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                  אימות סיסמה
                </Text>
                <View className="relative">
                  <TextInput
                    ref={confirmPasswordInputRef}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword)
                        clearFieldError('confirmPassword');
                    }}
                    onSubmitEditing={() => orgNameInputRef.current?.focus()}
                    placeholder="הקלד סיסמה שוב"
                    placeholderTextColor={COLORS.neutral[400]}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    returnKeyType="next"
                    editable={!isSubmitting}
                    className={`
                      h-[50px] rounded-[10px] px-[16px] pe-[48px]
                      text-[16px] font-rubik text-neutral-700
                      bg-cream-50
                      ${errors.confirmPassword ? 'border-[1.5px] border-danger-500' : 'border-[1.5px] border-cream-300'}
                      ${isSubmitting ? 'opacity-50' : ''}
                    `}
                    style={{ textAlign: 'right', writingDirection: 'ltr' }}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute start-[12px] top-[13px] p-[2px]"
                    hitSlop={8}
                    accessibilityLabel={
                      showConfirmPassword ? 'הסתר סיסמה' : 'הצג סיסמה'
                    }
                  >
                    <Feather
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={COLORS.neutral[400]}
                    />
                  </Pressable>
                </View>
                {errors.confirmPassword && (
                  <Animated.View
                    entering={FadeInUp.duration(200)}
                    className="flex-row items-center mt-[4px]"
                  >
                    <Feather
                      name="alert-circle"
                      size={16}
                      color={COLORS.danger[700]}
                    />
                    <Text className="text-[13px] font-rubik text-danger-700 me-[4px]">
                      {errors.confirmPassword}
                    </Text>
                  </Animated.View>
                )}
              </View>

              {/* Organization name */}
              <View className="mb-[24px]">
                <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                  שם ארגון / עסק
                </Text>
                <TextInput
                  ref={orgNameInputRef}
                  value={orgName}
                  onChangeText={(text) => {
                    setOrgName(text);
                    if (errors.orgName) clearFieldError('orgName');
                  }}
                  onSubmitEditing={handleSubmit}
                  placeholder="שם החברה או העסק"
                  placeholderTextColor={COLORS.neutral[400]}
                  autoCapitalize="words"
                  autoComplete="organization"
                  textContentType="organizationName"
                  returnKeyType="done"
                  editable={!isSubmitting}
                  className={`
                    h-[50px] rounded-[10px] px-[16px]
                    text-[16px] font-rubik text-neutral-700
                    bg-cream-50
                    ${errors.orgName ? 'border-[1.5px] border-danger-500' : 'border-[1.5px] border-cream-300'}
                    ${isSubmitting ? 'opacity-50' : ''}
                  `}
                  style={{ textAlign: 'right', writingDirection: 'rtl' }}
                />
                {errors.orgName && (
                  <Animated.View
                    entering={FadeInUp.duration(200)}
                    className="flex-row items-center mt-[4px]"
                  >
                    <Feather
                      name="alert-circle"
                      size={16}
                      color={COLORS.danger[700]}
                    />
                    <Text className="text-[13px] font-rubik text-danger-700 me-[4px]">
                      {errors.orgName}
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
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text className="text-white text-[15px] font-rubik-semibold">
                      צור חשבון
                    </Text>
                  )}
                </Pressable>
              </Animated.View>
            </Animated.View>

            {/* Login link */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(400).springify()}
              className="mt-[24px]"
            >
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="text-[15px] font-rubik text-neutral-500 text-center">
                    כבר יש לך חשבון?{' '}
                    <Text className="text-primary-500 font-rubik-medium">
                      התחבר
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
