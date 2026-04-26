import { forwardRef, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from '@/lib/haptics';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import { changePasswordSchema } from '@infield/shared';

import { supabase } from '@/lib/supabase';

// --- Types ---

interface ChangePasswordSheetProps {
  visible: boolean;
  onClose: () => void;
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

export function ChangePasswordSheet({
  visible,
  onClose,
  userEmail,
  onSuccess,
  onError,
}: ChangePasswordSheetProps) {
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

  const resetForm = useCallback(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordErrors({});
    setShowCurrentPassword(false);
    setShowNewPassword(false);
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

      resetForm();
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onSuccess();
      onClose();
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
    resetForm,
    onSuccess,
    onError,
    onClose,
  ]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Backdrop */}
        <Pressable
          onPress={handleClose}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: COLORS.cream[50],
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '75%',
            }}
          >
            {/* Handle bar */}
            <View
              style={{
                alignSelf: 'center',
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: COLORS.cream[300],
                marginTop: 10,
                marginBottom: 6,
              }}
            />
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 30 }}
            >
              <Animated.View style={[{ padding: 20 }, shakeStyle]}>
                {/* Title */}
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Rubik-SemiBold',
                    color: COLORS.neutral[800],
                    textAlign: 'right',
                    marginBottom: 20,
                  }}
                >
                  שינוי סיסמה
                </Text>

                {/* General error */}
                {passwordErrors.general && (
                  <Animated.View
                    entering={FadeInUp.duration(200)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: COLORS.danger[50],
                      borderWidth: 1,
                      borderColor: COLORS.danger[500],
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      marginBottom: 16,
                    }}
                  >
                    <Feather
                      name="alert-circle"
                      size={20}
                      color={COLORS.danger[500]}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'Rubik-Regular',
                        color: COLORS.danger[700],
                        marginStart: 8,
                        flex: 1,
                      }}
                    >
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
                    if (passwordErrors.currentPassword)
                      clearError('currentPassword');
                  }}
                  onSubmitEditing={() => newPasswordRef.current?.focus()}
                  placeholder="הזן סיסמה נוכחית"
                  showPassword={showCurrentPassword}
                  onToggleShow={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
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
                      buttonScale.value = withSpring(1, {
                        damping: 15,
                        stiffness: 150,
                      });
                    }}
                    disabled={isChanging}
                    style={{
                      backgroundColor: COLORS.primary[500],
                      height: 48,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: isChanging ? 0.5 : 1,
                    }}
                  >
                    {isChanging ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: 15,
                          fontFamily: 'Rubik-SemiBold',
                        }}
                      >
                        עדכן סיסמה
                      </Text>
                    )}
                  </Pressable>
                </Animated.View>
              </Animated.View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
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
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[700],
          marginBottom: 6,
          textAlign: 'right',
        }}
      >
        {label}
      </Text>
      <View style={{ position: 'relative' }}>
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
          style={{
            height: 50,
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingEnd: onToggleShow ? 48 : 16,
            fontSize: 16,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[700],
            backgroundColor: COLORS.cream[50],
            borderWidth: 1.5,
            borderColor: error ? COLORS.danger[500] : COLORS.cream[300],
            textAlign: 'right',
            writingDirection: 'ltr',
            opacity: disabled ? 0.5 : 1,
          }}
        />
        {onToggleShow && (
          <Pressable
            onPress={onToggleShow}
            style={{
              position: 'absolute',
              start: 12,
              top: 13,
              padding: 2,
            }}
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          <Feather name="alert-circle" size={16} color={COLORS.danger[700]} />
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-Regular',
              color: COLORS.danger[700],
              marginStart: 4,
            }}
          >
            {error}
          </Text>
        </Animated.View>
      )}
    </View>
  );
});
