import { useCallback, useEffect, useState } from 'react';
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
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';

import {
  useInspectorSettings,
  type InspectorSettings,
} from '@/hooks/useInspectorSettings';
import { useSignature } from '@/hooks/useSignature';
import { CompletionIndicator } from './CompletionIndicator';
import { SignatureStampSection } from './SignatureStampSection';

// --- Field definitions ---

interface FieldConfig {
  key: 'license_number' | 'education' | 'experience' | 'company_name';
  label: string;
  placeholder: string;
}

const FIELDS: FieldConfig[] = [
  {
    key: 'license_number',
    label: 'מספר רישיון',
    placeholder: 'הזן מספר רישיון',
  },
  {
    key: 'education',
    label: 'השכלה',
    placeholder: 'הזן השכלה',
  },
  {
    key: 'experience',
    label: 'שנות ניסיון',
    placeholder: 'הזן שנות ניסיון',
  },
  {
    key: 'company_name',
    label: 'שם החברה',
    placeholder: 'הזן שם חברה',
  },
];

// --- Types ---

interface InspectorTabProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

// --- Component ---

export function InspectorTab({ onSuccess, onError }: InspectorTabProps) {
  const { rawSettings, saveSettings, isLoading, isSaving } =
    useInspectorSettings();
  const { inspectorSignatureUrl } = useSignature();

  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);

  // Initialize local state from raw settings
  useEffect(() => {
    if (!isLoading && !initialized) {
      const vals: Record<string, string> = {};
      for (const f of FIELDS) {
        vals[f.key] = (rawSettings[f.key] as string) ?? '';
      }
      setLocalValues(vals);
      setInitialized(true);
    }
  }, [isLoading, initialized, rawSettings]);

  const isDirty =
    initialized &&
    FIELDS.some(
      (f) =>
        (localValues[f.key] ?? '') !== ((rawSettings[f.key] as string) ?? '')
    );

  const handleSave = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const patch: Partial<InspectorSettings> = {};
    for (const f of FIELDS) {
      (patch as Record<string, string>)[f.key] = localValues[f.key] ?? '';
    }
    saveSettings({ ...rawSettings, ...patch });
    onSuccess('הפרטים נשמרו בהצלחה');
  }, [localValues, rawSettings, saveSettings, onSuccess]);

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Completion items
  const completionItems = [
    {
      label: 'חתימה',
      completed: !!inspectorSignatureUrl,
    },
    {
      label: 'מספר רישיון',
      completed: !!(localValues.license_number || rawSettings.license_number),
    },
    {
      label: 'השכלה',
      completed: !!(localValues.education || rawSettings.education),
    },
    {
      label: 'שם חברה',
      completed: !!(localValues.company_name || rawSettings.company_name),
    },
  ];

  return (
    <View>
      {/* Completion indicator */}
      <CompletionIndicator items={completionItems} />

      {/* Signature & Stamp */}
      <SignatureStampSection onSuccess={onSuccess} onError={onError} />

      {/* Divider */}
      <View
        style={{
          marginHorizontal: 20,
          height: 1,
          backgroundColor: COLORS.cream[200],
          marginBottom: 16,
        }}
      />

      {/* Professional fields */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(400)}
        style={{ marginHorizontal: 20, marginBottom: 24 }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Rubik-SemiBold',
            color: COLORS.neutral[800],
            textAlign: 'right',
            marginBottom: 16,
          }}
        >
          פרטים מקצועיים
        </Text>

        <View
          style={{
            backgroundColor: COLORS.cream[100],
            borderRadius: 14,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
          }}
        >
          {FIELDS.map((field, index) => (
            <View
              key={field.key}
              style={
                index < FIELDS.length - 1 ? { marginBottom: 16 } : undefined
              }
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik-Medium',
                  color: COLORS.neutral[700],
                  textAlign: 'right',
                  marginBottom: 6,
                }}
              >
                {field.label}
              </Text>
              <TextInput
                value={localValues[field.key] ?? ''}
                onChangeText={(text) =>
                  setLocalValues((prev) => ({ ...prev, [field.key]: text }))
                }
                placeholder={field.placeholder}
                placeholderTextColor={COLORS.neutral[400]}
                style={{
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.cream[200],
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 14,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[700],
                  textAlign: 'right',
                }}
              />
            </View>
          ))}
        </View>

        {/* Save button */}
        <Animated.View style={[buttonStyle, { marginTop: 16 }]}>
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
      </Animated.View>
    </View>
  );
}
