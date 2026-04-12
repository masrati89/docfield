import { forwardRef, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import { changePasswordSchema } from '@infield/shared';

import { supabase } from '@/lib/supabase';

// --- Types ---

interface ChangePasswordSectionProps {
  userEmail: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  general?: string;
}

type PasswordFieldKey = keyof PasswordErrors;

// --- Component ---

export function ChangePasswordSection({
  userEmail,
  onSuccess,
  onError,
}: ChangePasswordSectionProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [isChanging, setIsChanging] = useState(false);

  const newPasswordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
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

  const clearError = useCallback((field: PasswordFieldKey) => {
    setPasswordErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    clearError('general');

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    if (!result.success) {
      const fieldErrors: PasswordErrors = {};
      for (const err of result.error.errors) {
        const field = err.path[0] as PasswordFieldKey;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      }
      setPasswordErrors(fieldErrors);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      triggerShake();
      return;
    }

    setIsChanging(true);

    try {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (verifyError) {
        setPasswordErrors({ currentPassword: 'הסיסמה הנוכחית שגויה' });
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        triggerShake();
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setPasswordErrors({ general: 'אירעה שגיאה בעדכון הסיסמה. נסה שוב' });
        triggerShake();
        return;
      }

      // Success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordErrors({});
      setShowCurrentPassword(false);
      setShowNewPassword(false);

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onSuccess();
    } catch {
      onError('בעיית תקשורת. בדוק את החיבור לאינטרנט');
      triggerShake();
    } finally {
      setIsChanging(false);
    }
  }, [
    currentPassword,
    newPassword,
    confirmNewPassword,
    userEmail,
    triggerShake,
    clearError,
    onSuccess,
    onError,
  ]);

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(400)}
      className="mx-[20px] mb-[24px]"
      style={shakeStyle}
    >
      <Text className="text-[18px] font-rubik-semibold text-neutral-800 text-right mb-[16px]">
        אבטחה
      </Text>

      {/* General error */}
      {passwordErrors.general && (
        <Animated.View
          entering={FadeInUp.duration(200)}
          className="flex-row items-center bg-danger-50 border border-danger-500 rounded-[10px] px-[14px] py-[12px] mb-[16px]"
        >
          <Feather name="alert-circle" size={20} color={COLORS.danger[500]} />
          <Text className="text-[13px] font-rubik text-danger-700 me-[8px] flex-1">
            {passwordErrors.general}
          </Text>
        </Animated.View>
      )}

      {/* Current password */}
      <PasswordField
        label="סיסמה נוכחית"
        value={currentPassword}
        onChangeText={(t) => {
          setCurrentPassword(t);
          if (passwordErrors.currentPassword) clearError('currentPassword');
        }}
        onSubmitEditing={() => newPasswordRef.current?.focus()}
        placeholder="הזן סיסמה נוכחית"
        showPassword={showCurrentPassword}
        onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
        error={passwordErrors.currentPassword}
        disabled={isChanging}
        returnKeyType="next"
        autoComplete="current-password"
      />

      {/* New password */}
      <PasswordField
        ref={newPasswordRef}
        label="סיסמה חדשה"
        value={newPassword}
        onChangeText={(t) => {
          setNewPassword(t);
          if (passwordErrors.newPassword) clearError('newPassword');
        }}
        onSubmitEditing={() => confirmRef.current?.focus()}
        placeholder="לפחות 8 תווים"
        showPassword={showNewPassword}
        onToggleShow={() => setShowNewPassword(!showNewPassword)}
        error={passwordErrors.newPassword}
        disabled={isChanging}
        returnKeyType="next"
        autoComplete="new-password"
      />

      {/* Confirm */}
      <PasswordField
        ref={confirmRef}
        label="אימות סיסמה חדשה"
        value={confirmNewPassword}
        onChangeText={(t) => {
          setConfirmNewPassword(t);
          if (passwordErrors.confirmNewPassword)
            clearError('confirmNewPassword');
        }}
        onSubmitEditing={handleSubmit}
        placeholder="הקלד סיסמה חדשה שוב"
        error={passwordErrors.confirmNewPassword}
        disabled={isChanging}
        returnKeyType="done"
        autoComplete="new-password"
      />

      {/* Submit button */}
      <Animated.View style={buttonStyle}>
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web')
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleSubmit();
          }}
          onPressIn={() => {
            buttonScale.value = withSpring(0.98, {
              damping: 15,
              stiffness: 150,
            });
          }}
          onPressOut={() => {
            buttonScale.value = withSpring(1, { damping: 15, stiffness: 150 });
          }}
          disabled={isChanging}
          className={`bg-primary-500 h-[48px] rounded-[12px] items-center justify-center ${isChanging ? 'opacity-50' : ''}`}
        >
          {isChanging ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white text-[15px] font-rubik-semibold">
              עדכן סיסמה
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// --- PasswordField sub-component ---

interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  placeholder: string;
  showPassword?: boolean;
  onToggleShow?: () => void;
  error?: string;
  disabled: boolean;
  returnKeyType: 'next' | 'done';
  autoComplete: 'current-password' | 'new-password';
}

const PasswordField = forwardRef(function PasswordField(
  {
    label,
    value,
    onChangeText,
    onSubmitEditing,
    placeholder,
    showPassword,
    onToggleShow,
    error,
    disabled,
    returnKeyType,
    autoComplete,
  }: PasswordFieldProps,
  ref: React.Ref<TextInput>
) {
  return (
    <View className="mb-[16px]">
      <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
        {label}
      </Text>
      <View className="relative">
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={COLORS.neutral[400]}
          secureTextEntry={showPassword !== undefined ? !showPassword : true}
          autoCapitalize="none"
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          editable={!disabled}
          className={`h-[50px] rounded-[10px] px-[16px] ${onToggleShow ? 'pe-[48px]' : ''} text-[16px] font-rubik text-neutral-700 bg-cream-50 ${error ? 'border-[1.5px] border-danger-500' : 'border-[1.5px] border-cream-300'} ${disabled ? 'opacity-50' : ''}`}
          style={{ textAlign: 'right', writingDirection: 'ltr' }}
        />
        {onToggleShow && (
          <Pressable
            onPress={onToggleShow}
            className="absolute start-[12px] top-[13px] p-[2px]"
            hitSlop={8}
            accessibilityLabel={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.neutral[400]}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Animated.View
          entering={FadeInUp.duration(200)}
          className="flex-row items-center mt-[4px]"
        >
          <Feather name="alert-circle" size={16} color={COLORS.danger[700]} />
          <Text className="text-[13px] font-rubik text-danger-700 me-[4px]">
            {error}
          </Text>
        </Animated.View>
      )}
    </View>
  );
});
