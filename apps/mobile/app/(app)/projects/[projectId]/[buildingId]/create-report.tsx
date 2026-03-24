import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';
import type { ChecklistTemplateWithCounts } from '@docfield/shared';

import { useAuth } from '@/contexts/AuthContext';
import { useChecklistTemplates, useCreateReport } from '@/hooks/useReports';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { CardSkeleton } from '@/components/ui/CardSkeleton';

// --- Types ---

interface FieldErrors {
  tenantName?: string;
  tenantPhone?: string;
  template?: string;
}

// --- Template Radio Card ---

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: ChecklistTemplateWithCounts;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelect();
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`
        rounded-[14px] p-[16px] flex-row items-center mb-[8px]
        active:scale-[0.98]
        ${
          isSelected
            ? 'bg-primary-50 border-2 border-primary-500'
            : 'bg-white border border-cream-200'
        }
      `}
    >
      {/* Radio dot */}
      <View
        className={`
          w-[20px] h-[20px] rounded-full border-2 items-center justify-center
          ${isSelected ? 'border-primary-500' : 'border-cream-300'}
        `}
      >
        {isSelected && (
          <View className="w-[10px] h-[10px] rounded-full bg-primary-500" />
        )}
      </View>

      {/* Content */}
      <View className="flex-1 me-[12px]">
        <Text
          className={`text-[15px] font-rubik-semibold ${
            isSelected ? 'text-neutral-800' : 'text-neutral-600'
          }`}
        >
          {template.name}
        </Text>
        <Text className="text-[13px] font-rubik text-neutral-500 mt-[2px]">
          {template.itemCount} פריטים · {template.categoryCount} קטגוריות
        </Text>
      </View>

      {/* Global badge */}
      {template.isGlobal && (
        <View className="bg-gold-100 rounded-[6px] px-[8px] py-[2px]">
          <Text className="text-[11px] font-rubik-medium text-gold-700">
            גלובלי
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// --- Date Display ---

function formatHebrewDate(date: Date): string {
  return date.toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// --- Main Screen ---

export default function CreateReportScreen() {
  const router = useRouter();
  const { apartmentId } = useLocalSearchParams<{
    apartmentId: string;
  }>();
  const { profile } = useAuth();

  // Data
  const {
    data: templates,
    isLoading: templatesLoading,
    error: templatesError,
    refetch: refetchTemplates,
  } = useChecklistTemplates(profile?.organizationId ?? '');
  const createReport = useCreateReport();

  // Form state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [deliveryDate] = useState(new Date());
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  // Refs
  const tenantPhoneRef = useRef<TextInput>(null);

  // Shake animation
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

  // Auto-select first template when loaded
  const hasAutoSelected = useRef(false);
  if (templates && templates.length > 0 && !hasAutoSelected.current) {
    hasAutoSelected.current = true;
    if (!selectedTemplateId) {
      setSelectedTemplateId(templates[0].id);
    }
  }

  // Validation
  const validateField = useCallback(
    (field: 'tenantName' | 'tenantPhone') => {
      const value = field === 'tenantName' ? tenantName : tenantPhone;

      // Fields are optional — only validate if user entered something
      if (!value.trim()) {
        setErrors((previous) => {
          const next = { ...previous };
          delete next[field];
          return next;
        });
        return true;
      }

      if (field === 'tenantName' && value.trim().length < 2) {
        setErrors((previous) => ({
          ...previous,
          tenantName: 'שם חייב להכיל לפחות 2 תווים',
        }));
        return false;
      }

      if (field === 'tenantPhone' && !/^0[2-9]\d{7,8}$/.test(value.trim())) {
        setErrors((previous) => ({
          ...previous,
          tenantPhone: 'מספר טלפון לא תקין — פורמט: 0501234567',
        }));
        return false;
      }

      // Clear error
      setErrors((previous) => {
        const next = { ...previous };
        delete next[field];
        return next;
      });
      return true;
    },
    [tenantName, tenantPhone]
  );

  // Submit
  const handleSubmit = useCallback(async () => {
    // Validate template selection
    if (!selectedTemplateId) {
      setErrors((previous) => ({
        ...previous,
        template: 'יש לבחור תבנית צ׳קליסט',
      }));
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      triggerShake();
      return;
    }

    // Validate fields
    const nameValid = validateField('tenantName');
    const phoneValid = validateField('tenantPhone');

    if (!nameValid || !phoneValid) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      triggerShake();
      return;
    }

    if (!apartmentId) return;

    try {
      const report = await createReport.mutateAsync({
        apartmentId,
        checklistTemplateId: selectedTemplateId,
        reportType: 'delivery',
        tenantName: tenantName.trim() || undefined,
        tenantPhone: tenantPhone.trim() || undefined,
        deliveryDate: deliveryDate.toISOString(),
      });

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // TODO: Navigate to checklist screen with reportId (Phase 6)
      Alert.alert('דוח נוצר בהצלחה', `מספר סבב: ${report.roundNumber}`, [
        {
          text: 'אישור',
          onPress: () => router.back(),
        },
      ]);
    } catch {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('שגיאה', 'לא הצלחנו ליצור את הדוח. נסה שוב.', [
        { text: 'אישור' },
      ]);
    }
  }, [
    selectedTemplateId,
    validateField,
    apartmentId,
    createReport,
    tenantName,
    tenantPhone,
    deliveryDate,
    triggerShake,
    router,
  ]);

  // Button press handlers
  const handleButtonPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    handleSubmit();
  }, [handleSubmit]);

  // Template error state
  if (templatesError) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <StatusBar style="dark" />
        <ScreenHeader title="דוח מסירה חדש" showBack />
        <ErrorState onRetry={refetchTemplates} />
      </SafeAreaView>
    );
  }

  const isFormDisabled = createReport.isPending;

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />
      <ScreenHeader title="דוח מסירה חדש" showBack />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={shakeStyle}>
            {/* Template Selection */}
            <Animated.View entering={FadeInUp.duration(300)}>
              <Text className="text-[17px] font-rubik-semibold text-neutral-800 mb-[12px]">
                תבנית צ׳קליסט
              </Text>

              {templatesLoading ? (
                <CardSkeleton lines={2} showIcon={false} />
              ) : !templates || templates.length === 0 ? (
                <View className="bg-cream-100 rounded-[14px] p-[16px] items-center">
                  <Feather
                    name="clipboard"
                    size={24}
                    color={COLORS.neutral[400]}
                  />
                  <Text className="text-[15px] font-rubik text-neutral-500 mt-[8px]">
                    אין תבניות צ׳קליסט זמינות
                  </Text>
                </View>
              ) : (
                templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplateId === template.id}
                    onSelect={() => {
                      setSelectedTemplateId(template.id);
                      setErrors((previous) => {
                        const next = { ...previous };
                        delete next.template;
                        return next;
                      });
                    }}
                  />
                ))
              )}

              {errors.template ? (
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
                    {errors.template}
                  </Text>
                </Animated.View>
              ) : null}
            </Animated.View>

            {/* Delivery Date */}
            <Animated.View
              entering={FadeInUp.delay(50).duration(300)}
              className="mt-[24px]"
            >
              <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                תאריך מסירה
              </Text>
              <View className="h-[50px] rounded-[10px] border-[1.5px] border-cream-300 bg-cream-50 flex-row items-center px-[16px]">
                <Feather
                  name="calendar"
                  size={18}
                  color={COLORS.neutral[500]}
                />
                <Text className="text-[15px] font-rubik text-neutral-700 me-[10px] flex-1">
                  {formatHebrewDate(deliveryDate)}
                </Text>
              </View>
            </Animated.View>

            {/* Tenant Name */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(300)}
              className="mt-[16px]"
            >
              <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                שם הדייר
              </Text>
              <TextInput
                value={tenantName}
                onChangeText={(text) => {
                  setTenantName(text);
                  if (errors.tenantName) {
                    setErrors((previous) => {
                      const next = { ...previous };
                      delete next.tenantName;
                      return next;
                    });
                  }
                }}
                onBlur={() => validateField('tenantName')}
                onSubmitEditing={() => tenantPhoneRef.current?.focus()}
                placeholder="הכנס שם מלא"
                placeholderTextColor={COLORS.neutral[400]}
                autoCapitalize="words"
                returnKeyType="next"
                editable={!isFormDisabled}
                className={`
                  h-[50px] rounded-[10px] px-[16px]
                  text-[16px] font-rubik text-neutral-700
                  bg-cream-50
                  ${
                    errors.tenantName
                      ? 'border-[1.5px] border-danger-500'
                      : 'border-[1.5px] border-cream-300'
                  }
                  ${isFormDisabled ? 'opacity-50' : ''}
                `}
                style={{ textAlign: 'right' }}
              />
              {errors.tenantName ? (
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
                    {errors.tenantName}
                  </Text>
                </Animated.View>
              ) : null}
            </Animated.View>

            {/* Tenant Phone */}
            <Animated.View
              entering={FadeInUp.delay(150).duration(300)}
              className="mt-[16px]"
            >
              <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
                טלפון הדייר
              </Text>
              <TextInput
                ref={tenantPhoneRef}
                value={tenantPhone}
                onChangeText={(text) => {
                  setTenantPhone(text);
                  if (errors.tenantPhone) {
                    setErrors((previous) => {
                      const next = { ...previous };
                      delete next.tenantPhone;
                      return next;
                    });
                  }
                }}
                onBlur={() => validateField('tenantPhone')}
                onSubmitEditing={handleSubmit}
                placeholder="0501234567"
                placeholderTextColor={COLORS.neutral[400]}
                keyboardType="phone-pad"
                returnKeyType="done"
                editable={!isFormDisabled}
                className={`
                  h-[50px] rounded-[10px] px-[16px]
                  text-[16px] font-rubik text-neutral-700
                  bg-cream-50
                  ${
                    errors.tenantPhone
                      ? 'border-[1.5px] border-danger-500'
                      : 'border-[1.5px] border-cream-300'
                  }
                  ${isFormDisabled ? 'opacity-50' : ''}
                `}
                style={{ textAlign: 'left', writingDirection: 'ltr' }}
              />
              {errors.tenantPhone ? (
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
                    {errors.tenantPhone}
                  </Text>
                </Animated.View>
              ) : (
                <Text className="text-[13px] font-rubik text-neutral-400 mt-[4px]">
                  פורמט: 050-1234567
                </Text>
              )}
            </Animated.View>
          </Animated.View>
        </ScrollView>

        {/* Sticky CTA */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(300)}
          className="px-[20px] pb-[24px] pt-[12px] bg-cream-50"
        >
          <Pressable
            onPress={handleButtonPress}
            disabled={isFormDisabled}
            className={`
              h-[52px] rounded-[14px] bg-primary-500
              flex-row items-center justify-center
              active:bg-primary-600 active:scale-[0.98]
              ${isFormDisabled ? 'opacity-50' : ''}
            `}
          >
            {createReport.isPending ? (
              <Text className="text-[15px] font-rubik-semibold text-white">
                יוצר דוח...
              </Text>
            ) : (
              <>
                <Feather name="play" size={18} color="#FFFFFF" />
                <Text className="text-[15px] font-rubik-semibold text-white me-[8px]">
                  התחל בדיקה
                </Text>
              </>
            )}
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
