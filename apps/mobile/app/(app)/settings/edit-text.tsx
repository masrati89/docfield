import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

import {
  useInspectorSettings,
  type InspectorSettings,
} from '@/hooks/useInspectorSettings';

// --- Screen ---

export default function EditTextScreen() {
  const router = useRouter();
  const { field, label } = useLocalSearchParams<{
    field: string;
    label: string;
  }>();

  const { settings, rawSettings, saveSettings, isSaving } =
    useInspectorSettings();

  const settingsKey = field as keyof InspectorSettings;

  // Get current value from merged settings (includes defaults)
  const currentValue = String(
    (settings[settingsKey] as string | undefined) ?? ''
  );

  const [localValue, setLocalValue] = useState(currentValue);
  const [initialized, setInitialized] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmLabel: string;
    cancelLabel: string;
  } | null>(null);

  // Initialize local value once settings load
  useEffect(() => {
    if (!initialized && currentValue) {
      setLocalValue(currentValue);
      setInitialized(true);
    }
  }, [currentValue, initialized]);

  const isDirty = localValue !== currentValue;

  const handleSave = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    saveSettings({ ...rawSettings, [settingsKey]: localValue });
  }, [rawSettings, settingsKey, localValue, saveSettings]);

  const handleBack = useCallback(() => {
    if (!isDirty) {
      router.back();
      return;
    }
    setConfirmAction({
      title: 'שינויים לא נשמרו',
      message: 'האם לשמור את השינויים לפני יציאה?',
      confirmLabel: 'שמור וצא',
      cancelLabel: 'צא ללא שמירה',
      onConfirm: () => {
        saveSettings({ ...rawSettings, [settingsKey]: localValue });
        router.back();
      },
    });
  }, [isDirty, router, rawSettings, settingsKey, localValue, saveSettings]);

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream[50] }}>
      <StatusBar style="dark" animated />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
          gap: 12,
        }}
      >
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: COLORS.cream[100],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="arrow-right" size={20} color={COLORS.neutral[600]} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontFamily: 'Rubik-SemiBold',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        >
          {label ?? field}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Text input */}
        <TextInput
          value={localValue}
          onChangeText={setLocalValue}
          multiline
          textAlignVertical="top"
          placeholder="הזן טקסט..."
          placeholderTextColor={COLORS.neutral[400]}
          style={{
            flex: 1,
            padding: 16,
            fontSize: 14,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[700],
            textAlign: 'right',
            lineHeight: 22,
          }}
        />

        {/* Save button */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 8,
          }}
        >
          <Animated.View style={buttonStyle}>
            <Pressable
              onPress={handleSave}
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
              disabled={!isDirty || isSaving}
              style={{
                backgroundColor: COLORS.primary[500],
                height: 48,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: !isDirty || isSaving ? 0.4 : 1,
              }}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 15,
                    fontFamily: 'Rubik-SemiBold',
                  }}
                >
                  שמור
                </Text>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>

      {/* Confirmation modal (replaces Alert.alert for cross-platform) */}
      <Modal
        visible={!!confirmAction}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmAction(null)}
      >
        <Pressable
          onPress={() => setConfirmAction(null)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              width: '100%',
              maxWidth: 320,
              backgroundColor: COLORS.cream[50],
              borderRadius: 14,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[800],
                textAlign: 'right',
                marginBottom: 8,
              }}
            >
              {confirmAction?.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[600],
                textAlign: 'right',
                marginBottom: 20,
              }}
            >
              {confirmAction?.message}
            </Text>
            <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
              <Pressable
                onPress={() => {
                  confirmAction?.onConfirm();
                  setConfirmAction(null);
                }}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: COLORS.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Rubik-SemiBold',
                    color: COLORS.white,
                  }}
                >
                  {confirmAction?.confirmLabel ?? 'אישור'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setConfirmAction(null);
                  router.back();
                }}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: COLORS.cream[100],
                  borderWidth: 1,
                  borderColor: COLORS.cream[200],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Rubik-Medium',
                    color: COLORS.neutral[600],
                  }}
                >
                  {confirmAction?.cancelLabel ?? 'ביטול'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
