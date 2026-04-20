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

import * as Crypto from 'expo-crypto';

import { COLORS } from '@infield/ui';
import {
  fullRegisterSchema,
  PROFESSIONS,
  PROFESSION_LABELS,
} from '@infield/shared';
import type { ProfessionValue } from '@infield/shared';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useOAuth } from '@/hooks/useOAuth';
import { SocialAuthButtons } from '@/components/auth';

// --- Field error type ---

interface FieldErrors {
  firstName?: string;
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  profession?: string;
  orgName?: string;
  general?: string;
}

type FieldKey = keyof FieldErrors;

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const {
    signInWithGoogle,
    signInWithApple,
    isLoading: oauthLoading,
    loadingProvider,
  } = useOAuth();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profession, setProfession] = useState<ProfessionValue | ''>('');
  const [orgName, setOrgName] = useState('');
  const [showProfessionPicker, setShowProfessionPicker] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation helper
  const passwordValid =
    password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

  // Refs for focus management
  const firstNameInputRef = useRef<TextInput>(null);
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

  // OAuth handlers
  const handleGooglePress = useCallback(async () => {
    const { error, needsCompletion } = await signInWithGoogle();
    if (error) {
      setErrors({ general: error });
      triggerShake();
      return;
    }
    if (needsCompletion) {
      router.replace('/(auth)/complete-profile');
    } else {
      router.replace('/(app)');
    }
  }, [signInWithGoogle, triggerShake]);

  const handleApplePress = useCallback(async () => {
    const { error, needsCompletion } = await signInWithApple();
    if (error) {
      setErrors({ general: error });
      triggerShake();
      return;
    }
    if (needsCompletion) {
      router.replace('/(auth)/complete-profile');
    } else {
      router.replace('/(app)');
    }
  }, [signInWithApple, triggerShake]);

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
      firstName: firstName.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      profession: profession || undefined,
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

      // Step 3: Create organization (generate UUID client-side —
      // SELECT policy requires user profile, which doesn't exist yet)
      const newOrgId = Crypto.randomUUID();
      console.warn('[Register] Step 3: creating org', newOrgId);
      const { error: orgError } = await supabase.from('organizations').insert({
        id: newOrgId,
        name: orgName.trim(),
      });

      if (orgError) {
        console.error(
          '[Register] Step 3 failed:',
          orgError.message,
          orgError.code
        );
        await supabase.auth.signOut();
        setErrors({ general: `שגיאה ביצירת הארגון: ${orgError.message}` });
        triggerShake();
        return;
      }
      console.warn('[Register] Step 3: org created successfully');

      // Step 4: Create user profile
      console.warn('[Register] Step 4: creating user profile', newUser.id);
      const { error: profileError } = await supabase.from('users').insert({
        id: newUser.id,
        organization_id: newOrgId,
        email: email.trim(),
        full_name: fullName.trim(),
        first_name: firstName.trim(),
        profession: profession || null,
        role: 'admin',
        is_active: true,
      });

      if (profileError) {
        console.error(
          '[Register] Step 4 failed:',
          profileError.message,
          profileError.code,
          profileError.details
        );
        // Rollback: delete org and sign out
        await supabase.from('organizations').delete().eq('id', newOrgId);
        await supabase.auth.signOut();
        setErrors({ general: `שגיאה ביצירת הפרופיל: ${profileError.message}` });
        triggerShake();
        return;
      }
      console.warn('[Register] Step 4: user profile created successfully');

      // Success — sign out so user must verify email first
      await supabase.auth.signOut();

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.replace({
        pathname: '/(auth)/verify-email',
        params: { email: email.trim() },
      });
    } catch {
      setErrors({ general: 'בעיית תקשורת. בדוק את החיבור לאינטרנט' });
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  }, [
    firstName,
    fullName,
    email,
    password,
    confirmPassword,
    profession,
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

            {/* Social auth buttons */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(500).springify()}
              className="w-full mb-[8px]"
            >
              <SocialAuthButtons
                onGooglePress={handleGooglePress}
                onApplePress={handleApplePress}
                isLoading={oauthLoading}
                loadingProvider={loadingProvider}
              />
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

              {/* First name */}
              <View className="mb-[16px]">
                <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                  שם פרטי
                </Text>
                <TextInput
                  ref={firstNameInputRef}
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (errors.firstName) clearFieldError('firstName');
                  }}
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                  placeholder="ישראל"
                  placeholderTextColor={COLORS.neutral[400]}
                  autoCapitalize="words"
                  autoComplete="given-name"
                  textContentType="givenName"
                  returnKeyType="next"
                  editable={!isSubmitting}
                  className={`
                    h-[50px] rounded-[10px] px-[16px]
                    text-[16px] font-rubik text-neutral-700
                    bg-cream-50
                    ${errors.firstName ? 'border-[1.5px] border-danger-500' : 'border-[1.5px] border-cream-300'}
                    ${isSubmitting ? 'opacity-50' : ''}
                  `}
                  style={{ textAlign: 'right', writingDirection: 'rtl' }}
                />
                {errors.firstName && (
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
                      {errors.firstName}
                    </Text>
                  </Animated.View>
                )}
              </View>

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
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  editable={!isSubmitting}
                  className={`
                    h-[50px] rounded-[10px] px-[16px]
                    text-[16px] font-rubik text-neutral-700
                    bg-cream-50
                    ${errors.password ? 'border-[1.5px] border-danger-500' : 'border-[1.5px] border-cream-300'}
                    ${isSubmitting ? 'opacity-50' : ''}
                  `}
                  style={{ textAlign: 'right', writingDirection: 'ltr' }}
                />
                {/* Password helper text */}
                <View className="flex-row-reverse items-center mt-[4px]">
                  <Feather
                    name={passwordValid ? 'check-circle' : 'info'}
                    size={14}
                    color={
                      passwordValid ? COLORS.primary[500] : COLORS.neutral[400]
                    }
                  />
                  <Text
                    className="text-[12px] font-rubik me-[4px]"
                    style={{
                      color: passwordValid
                        ? COLORS.primary[500]
                        : COLORS.neutral[400],
                    }}
                  >
                    לפחות 8 תווים, אות גדולה אחת ומספר אחד
                  </Text>
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
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  editable={!isSubmitting}
                  className={`
                    h-[50px] rounded-[10px] px-[16px]
                    text-[16px] font-rubik text-neutral-700
                    bg-cream-50
                    ${errors.confirmPassword ? 'border-[1.5px] border-danger-500' : 'border-[1.5px] border-cream-300'}
                    ${isSubmitting ? 'opacity-50' : ''}
                  `}
                  style={{ textAlign: 'right', writingDirection: 'ltr' }}
                />
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

              {/* Profession selector */}
              <View className="mb-[16px]">
                <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                  תפקיד
                </Text>
                <Pressable
                  onPress={() => setShowProfessionPicker(!showProfessionPicker)}
                  disabled={isSubmitting}
                  className={`
                    h-[50px] rounded-[10px] px-[16px]
                    flex-row-reverse items-center justify-between
                    bg-cream-50
                    ${errors.profession ? 'border-[1.5px] border-danger-500' : 'border-[1.5px] border-cream-300'}
                    ${isSubmitting ? 'opacity-50' : ''}
                  `}
                >
                  <Text
                    className="text-[16px] font-rubik"
                    style={{
                      color: profession
                        ? COLORS.neutral[700]
                        : COLORS.neutral[400],
                    }}
                  >
                    {profession
                      ? PROFESSION_LABELS[profession]
                      : 'בחר תפקיד...'}
                  </Text>
                  <Feather
                    name={showProfessionPicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.neutral[400]}
                  />
                </Pressable>

                {showProfessionPicker && (
                  <Animated.View
                    entering={FadeInUp.duration(200)}
                    className="mt-[4px] rounded-[10px] border-[1px] border-cream-300 bg-cream-50 overflow-hidden"
                  >
                    {PROFESSIONS.map((p) => (
                      <Pressable
                        key={p}
                        onPress={() => {
                          setProfession(p);
                          setShowProfessionPicker(false);
                          if (errors.profession) clearFieldError('profession');
                          if (Platform.OS !== 'web') {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Light
                            );
                          }
                        }}
                        className={`
                          h-[44px] px-[16px] flex-row-reverse items-center
                          border-b-[1px] border-cream-200
                          ${profession === p ? 'bg-primary-50' : ''}
                        `}
                      >
                        <Text
                          className="text-[15px] font-rubik flex-1"
                          style={{
                            textAlign: 'right',
                            color:
                              profession === p
                                ? COLORS.primary[700]
                                : COLORS.neutral[700],
                            fontFamily:
                              profession === p
                                ? 'Rubik-SemiBold'
                                : 'Rubik-Regular',
                          }}
                        >
                          {PROFESSION_LABELS[p]}
                        </Text>
                        {profession === p && (
                          <Feather
                            name="check"
                            size={16}
                            color={COLORS.primary[500]}
                          />
                        )}
                      </Pressable>
                    ))}
                  </Animated.View>
                )}

                {errors.profession && (
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
                      {errors.profession}
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
