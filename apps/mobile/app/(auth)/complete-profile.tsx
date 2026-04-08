import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// --- Constants ---

const PROFESSIONS = [
  'בודק בדק בית',
  'מהנדס',
  'אדריכל',
  'מנהל פרויקטים',
  'קבלן',
  'אחר',
] as const;

type Profession = (typeof PROFESSIONS)[number];

// --- Field errors ---

interface FieldErrors {
  name?: string;
  profession?: string;
  orgName?: string;
  general?: string;
}

// --- Screen ---

export default function CompleteProfileScreen() {
  const { user } = useAuth();

  // Pre-fill name from OAuth metadata
  const oauthName: string =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    '';

  const oauthAvatarUrl: string | undefined = user?.user_metadata?.avatar_url as
    | string
    | undefined;

  // Detect OAuth provider
  const providerType: string =
    (user?.app_metadata?.provider as string | undefined) ?? 'google';

  // Form state
  const [name, setName] = useState(oauthName);
  const [profession, setProfession] = useState<Profession | null>(null);
  const [orgName, setOrgName] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Button animation
  const buttonScale = useSharedValue(1);
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Shake animation
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

  const clearFieldError = useCallback((field: keyof FieldErrors) => {
    setErrors((previous) => {
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }, []);

  // --- Submit ---

  const handleSubmit = useCallback(async () => {
    clearFieldError('general');

    // Validate
    const fieldErrors: FieldErrors = {};
    if (!name.trim()) fieldErrors.name = 'נא להזין שם מלא';
    if (!profession) fieldErrors.profession = 'נא לבחור מקצוע';
    if (!orgName.trim()) fieldErrors.orgName = 'נא להזין שם ארגון';

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      triggerShake();
      return;
    }

    if (!user) {
      setErrors({ general: 'לא נמצא משתמש מחובר. נסה להתחבר מחדש' });
      return;
    }

    setIsSubmitting(true);

    let createdOrgId: string | null = null;

    try {
      // Step 1: Create organization
      const newOrgId = crypto.randomUUID();
      const { error: orgError } = await supabase
        .from('organizations')
        .insert({ id: newOrgId, name: orgName.trim() });

      if (orgError) {
        setErrors({ general: 'אירעה שגיאה ביצירת הארגון. נסה שוב' });
        triggerShake();
        return;
      }

      createdOrgId = newOrgId;

      // Step 2: Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: user.id,
        organization_id: newOrgId,
        email: user.email,
        full_name: name.trim(),
        role: 'admin',
        is_active: true,
        avatar_url: oauthAvatarUrl ?? null,
        provider: providerType,
      });

      if (profileError) {
        // Rollback: delete the org we just created
        await supabase.from('organizations').delete().eq('id', newOrgId);
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
      // Rollback org if it was created but profile failed
      if (createdOrgId) {
        await supabase.from('organizations').delete().eq('id', createdOrgId);
      }
      setErrors({ general: 'בעיית תקשורת. בדוק את החיבור לאינטרנט' });
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  }, [
    name,
    profession,
    orgName,
    user,
    oauthAvatarUrl,
    providerType,
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
            {/* Logo */}
            <Animated.View
              entering={FadeInUp.duration(600).springify()}
              className="items-center mb-[40px]"
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
                השלמת פרופיל
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
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) clearFieldError('name');
                  }}
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
                    ${errors.name ? 'border-[1.5px] border-danger-500' : 'border-[1.5px] border-cream-300'}
                    ${isSubmitting ? 'opacity-50' : ''}
                  `}
                  style={{ textAlign: 'right', writingDirection: 'rtl' }}
                />
                {errors.name && (
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
                      {errors.name}
                    </Text>
                  </Animated.View>
                )}
              </View>

              {/* Profession picker */}
              <View className="mb-[16px]">
                <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                  מקצוע
                </Text>
                <View
                  className={`
                    rounded-[10px] border-[1.5px] overflow-hidden
                    ${errors.profession ? 'border-danger-500' : 'border-cream-300'}
                  `}
                >
                  {PROFESSIONS.map((item, index) => {
                    const isSelected = profession === item;
                    const isLast = index === PROFESSIONS.length - 1;

                    return (
                      <Pressable
                        key={item}
                        onPress={() => {
                          if (!isSubmitting) {
                            setProfession(item);
                            if (errors.profession)
                              clearFieldError('profession');
                            if (Platform.OS !== 'web') {
                              Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light
                              );
                            }
                          }
                        }}
                        className={`
                          flex-row items-center justify-between
                          px-[16px] py-[14px]
                          ${isSelected ? 'bg-primary-50' : 'bg-cream-50'}
                          ${!isLast ? 'border-b border-cream-200' : ''}
                          ${isSubmitting ? 'opacity-50' : ''}
                        `}
                      >
                        <Text
                          className={`
                            text-[15px] font-rubik
                            ${isSelected ? 'text-primary-700 font-rubik-medium' : 'text-neutral-700'}
                          `}
                        >
                          {item}
                        </Text>

                        {/* Radio circle */}
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: isSelected ? 0 : 1.5,
                            borderColor: isSelected
                              ? 'transparent'
                              : COLORS.neutral[300],
                            backgroundColor: isSelected
                              ? COLORS.primary[500]
                              : 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSelected && (
                            <View
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: COLORS.white,
                              }}
                            />
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
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
              <View className="mb-[32px]">
                <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                  שם ארגון / עסק
                </Text>
                <TextInput
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
                      התחל להשתמש
                    </Text>
                  )}
                </Pressable>
              </Animated.View>
            </Animated.View>

            {/* Back to email login */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(400).springify()}
              className="mt-[24px]"
            >
              <Pressable onPress={() => router.replace('/(auth)/login')}>
                <Text className="text-[15px] font-rubik text-neutral-500 text-center">
                  התחבר עם אימייל במקום
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
