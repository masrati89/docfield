import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';
import { ROOM_TYPES, DEFECT_CATEGORIES } from '@docfield/shared';
import type { DefectSeverity } from '@docfield/shared';

import {
  useDefects,
  useCreateDefect,
  useUpdateDefect,
  useDeleteDefect,
  useUploadPhoto,
  useDeletePhoto,
} from '@/hooks/useDefects';
import { SeverityPills } from '@/components/defects/SeverityPills';
import { PhotoGallery } from '@/components/defects/PhotoGallery';
import { DropdownField } from '@/components/defects/DropdownField';

// --- Types ---

interface FormErrors {
  description?: string;
  severity?: string;
  room?: string;
  category?: string;
}

// --- Main Screen ---

export default function DefectDetailScreen() {
  const router = useRouter();
  const { reportId, defectId } = useLocalSearchParams<{
    reportId: string;
    defectId: string;
  }>();

  const isNew = defectId === 'new';

  // Data
  const { data: defects } = useDefects(reportId ?? '');
  const existingDefect = defects?.find((defect) => defect.id === defectId);

  const createDefectMutation = useCreateDefect(reportId ?? '');
  const updateDefectMutation = useUpdateDefect(reportId ?? '');
  const deleteDefectMutation = useDeleteDefect(reportId ?? '');
  const uploadPhotoMutation = useUploadPhoto(reportId ?? '');
  const deletePhotoMutation = useDeletePhoto(reportId ?? '');

  // Form state
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<DefectSeverity | undefined>(
    undefined
  );
  const [room, setRoom] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize form from existing defect
  useEffect(() => {
    if (existingDefect && !hasInitialized) {
      setDescription(existingDefect.description);
      setSeverity(existingDefect.severity);
      setRoom(existingDefect.room);
      setCategory(existingDefect.category);
      setHasInitialized(true);
    }
  }, [existingDefect, hasInitialized]);

  // Validation
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!description.trim() || description.trim().length < 2) {
      newErrors.description = 'תיאור חייב להכיל לפחות 2 תווים';
    }
    if (!severity) {
      newErrors.severity = 'יש לבחור חומרה';
    }
    if (!room) {
      newErrors.room = 'יש לבחור חדר';
    }
    if (!category) {
      newErrors.category = 'יש לבחור קטגוריה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [description, severity, room, category]);

  // Save
  const handleSave = useCallback(async () => {
    if (!validate()) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      if (isNew) {
        await createDefectMutation.mutateAsync({
          deliveryReportId: reportId ?? '',
          description: description.trim(),
          severity: severity!,
          room,
          category,
          source: 'manual',
        });
      } else {
        await updateDefectMutation.mutateAsync({
          defectId: defectId ?? '',
          data: {
            description: description.trim(),
            severity,
            room,
            category,
          },
        });
      }

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.back();
    } catch {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('שגיאה', 'לא הצלחנו לשמור. נסה שוב.');
    }
  }, [
    validate,
    isNew,
    createDefectMutation,
    updateDefectMutation,
    reportId,
    defectId,
    description,
    severity,
    room,
    category,
    router,
  ]);

  // Delete
  const handleDelete = useCallback(() => {
    if (isNew) return;

    Alert.alert('מחיקת ליקוי', 'למחוק את הליקוי?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחק',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDefectMutation.mutateAsync(defectId ?? '');
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            }
            router.back();
          } catch {
            Alert.alert('שגיאה', 'לא הצלחנו למחוק. נסה שוב.');
          }
        },
      },
    ]);
  }, [isNew, defectId, deleteDefectMutation, router]);

  // Camera
  const handleAddPhoto = useCallback(() => {
    if (isNew) {
      Alert.alert('שמור קודם', 'יש לשמור את הליקוי לפני הוספת תמונות.');
      return;
    }

    router.push({
      pathname: '/reports/[reportId]/defects/camera',
      params: { reportId: reportId ?? '', defectId: defectId ?? '' },
    });
  }, [isNew, router, reportId, defectId]);

  const handleDeletePhoto = useCallback(
    (photoId: string, imageUrl: string) => {
      Alert.alert('מחיקת תמונה', 'למחוק את התמונה?', [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: () => {
            deletePhotoMutation.mutate({ photoId, imageUrl });
          },
        },
      ]);
    },
    [deletePhotoMutation]
  );

  const isSaving =
    createDefectMutation.isPending || updateDefectMutation.isPending;

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />

      {/* Header with delete button */}
      <View className="flex-row items-center px-[20px] pt-[12px] pb-[16px]">
        <Pressable
          onPress={() => router.back()}
          className="w-[44px] h-[44px] rounded-[10px] items-center justify-center active:bg-cream-100"
          hitSlop={8}
        >
          <Feather name="chevron-right" size={24} color={COLORS.neutral[700]} />
        </Pressable>
        <Text
          className="text-[24px] font-rubik-bold text-neutral-800 flex-1"
          numberOfLines={1}
        >
          {isNew ? 'ליקוי חדש' : 'פרטי ליקוי'}
        </Text>
        {!isNew && (
          <Pressable
            onPress={handleDelete}
            className="w-[44px] h-[44px] rounded-[10px] items-center justify-center active:bg-danger-50"
            hitSlop={8}
          >
            <Feather name="trash-2" size={20} color={COLORS.danger[500]} />
          </Pressable>
        )}
      </View>

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
          {/* Photo Gallery — only for existing defects */}
          {!isNew && existingDefect && (
            <Animated.View
              entering={FadeInUp.duration(300)}
              className="mb-[20px]"
            >
              <Text className="text-[14px] font-rubik text-neutral-700 mb-[8px]">
                תמונות
              </Text>
              <PhotoGallery
                photos={existingDefect.photos}
                onAddPhoto={handleAddPhoto}
                onDeletePhoto={handleDeletePhoto}
              />
              {uploadPhotoMutation.isPending && (
                <Text className="text-[13px] font-rubik text-neutral-400 mt-[4px]">
                  מעלה תמונה...
                </Text>
              )}
            </Animated.View>
          )}

          {/* Description */}
          <Animated.View
            entering={FadeInUp.delay(50).duration(300)}
            className="mb-[16px]"
          >
            <Text className="text-[14px] font-rubik text-neutral-700 mb-[6px]">
              תיאור הליקוי
            </Text>
            <TextInput
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) {
                  setErrors((previous) => {
                    const next = { ...previous };
                    delete next.description;
                    return next;
                  });
                }
              }}
              placeholder="תאר את הליקוי..."
              placeholderTextColor={COLORS.neutral[400]}
              multiline
              numberOfLines={3}
              className="rounded-[10px] px-[16px] py-[14px] text-[16px] font-rubik text-neutral-700 bg-cream-50"
              style={{
                borderWidth: 1.5,
                borderColor: errors.description
                  ? COLORS.danger[500]
                  : COLORS.cream[300],
                minHeight: 80,
                textAlign: 'right',
                textAlignVertical: 'top',
              }}
            />
            {errors.description ? (
              <View className="flex-row items-center mt-[4px]">
                <Feather
                  name="alert-circle"
                  size={14}
                  color={COLORS.danger[700]}
                />
                <Text className="text-[13px] font-rubik text-danger-700 me-[4px]">
                  {errors.description}
                </Text>
              </View>
            ) : null}
          </Animated.View>

          {/* Severity */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(300)}
            className="mb-[16px]"
          >
            <Text className="text-[14px] font-rubik text-neutral-700 mb-[8px]">
              חומרה
            </Text>
            <SeverityPills
              value={severity}
              onChange={(value) => {
                setSeverity(value);
                if (errors.severity) {
                  setErrors((previous) => {
                    const next = { ...previous };
                    delete next.severity;
                    return next;
                  });
                }
              }}
            />
            {errors.severity ? (
              <View className="flex-row items-center mt-[4px]">
                <Feather
                  name="alert-circle"
                  size={14}
                  color={COLORS.danger[700]}
                />
                <Text className="text-[13px] font-rubik text-danger-700 me-[4px]">
                  {errors.severity}
                </Text>
              </View>
            ) : null}
          </Animated.View>

          {/* Room */}
          <Animated.View
            entering={FadeInUp.delay(150).duration(300)}
            className="mb-[16px]"
          >
            <DropdownField
              label="חדר"
              value={room}
              options={ROOM_TYPES}
              placeholder="בחר חדר"
              onChange={(value) => {
                setRoom(value);
                if (errors.room) {
                  setErrors((previous) => {
                    const next = { ...previous };
                    delete next.room;
                    return next;
                  });
                }
              }}
              error={errors.room}
            />
          </Animated.View>

          {/* Category */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(300)}
            className="mb-[16px]"
          >
            <DropdownField
              label="קטגוריה"
              value={category}
              options={DEFECT_CATEGORIES}
              placeholder="בחר קטגוריה"
              onChange={(value) => {
                setCategory(value);
                if (errors.category) {
                  setErrors((previous) => {
                    const next = { ...previous };
                    delete next.category;
                    return next;
                  });
                }
              }}
              error={errors.category}
            />
          </Animated.View>
        </ScrollView>

        {/* Fixed CTA */}
        <Animated.View
          entering={FadeInUp.delay(250).duration(300)}
          className="absolute bottom-0 left-0 right-0 px-[20px] pb-[24px] pt-[12px] bg-cream-50"
          style={{
            shadowColor: COLORS.neutral[900],
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <SafeAreaView edges={['bottom']}>
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              className={`
                h-[52px] rounded-[14px] bg-primary-500
                flex-row items-center justify-center
                active:bg-primary-600 active:scale-[0.98]
                ${isSaving ? 'opacity-50' : ''}
              `}
            >
              {isSaving ? (
                <Text className="text-[15px] font-rubik-semibold text-white">
                  שומר...
                </Text>
              ) : (
                <>
                  <Feather name="check" size={18} color="#FFFFFF" />
                  <Text className="text-[15px] font-rubik-semibold text-white me-[8px]">
                    {isNew ? 'צור ליקוי' : 'שמור שינויים'}
                  </Text>
                </>
              )}
            </Pressable>
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
