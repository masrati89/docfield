import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { ROOM_TYPES } from '@infield/shared';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Button, Toast } from '@/components/ui';
import { CameraCapture } from '@/components/camera/CameraCapture';

import {
  FormField,
  CategoryPicker,
  CostSection,
  PhotoGrid,
} from '@/components/defect';

import type { PhotoItem } from '@/components/defect/PhotoGrid';

// --- Constants ---

const MAX_PHOTOS = 10;

// --- Screen ---

export default function AddDefectScreen() {
  const { id: reportId, category: initialCategory } = useLocalSearchParams<{
    id: string;
    category?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  // Form state
  const [category, setCategory] = useState(initialCategory ?? '');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [costUnit, setCostUnit] = useState('fixed');
  const [costAmount, setCostAmount] = useState('');
  const [costQty, setCostQty] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [note, setNote] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const savedRef = useRef(false);

  const organizationId = profile?.organizationId ?? '';

  // Dirty check — warn if user tries to leave with unsaved changes
  const isDirty =
    !!category ||
    !!description.trim() ||
    !!location ||
    !!recommendation.trim() ||
    !!costAmount ||
    !!costQty ||
    !!costPerUnit ||
    !!note.trim() ||
    photos.length > 0;

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isDirty || savedRef.current) return;

      // Prevent default behavior of leaving the screen
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any).preventDefault();

      Alert.alert(
        'שינויים שלא נשמרו',
        'יש שינויים שלא נשמרו. לצאת בלי לשמור?',
        [
          { text: 'ביטול', style: 'cancel' },
          {
            text: 'צא בלי לשמור',
            style: 'destructive',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onPress: () => navigation.dispatch((e as any).data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [isDirty, navigation]);

  // Progress
  const filledCount = [
    category,
    description,
    location,
    recommendation,
    costAmount || costQty,
    note,
    photos.length > 0,
  ].filter(Boolean).length;
  const totalFields = 7;
  const canSave = !!category && description.trim().length > 0;

  const handleAddPhoto = useCallback(() => {
    if (photos.length >= MAX_PHOTOS) {
      showToast('ניתן להוסיף עד 10 תמונות', 'error');
      return;
    }
    setCameraVisible(true);
  }, [photos.length, showToast]);

  const handleCameraCapture = useCallback(
    (result: { localUri: string; publicUrl: string }) => {
      if (photos.length >= MAX_PHOTOS) {
        showToast('ניתן להוסיף עד 10 תמונות', 'error');
        setCameraVisible(false);
        return;
      }

      const newPhoto: PhotoItem = {
        id: String(Date.now()),
        localUri: result.localUri,
        publicUrl: result.publicUrl,
        isUploading: false,
      };

      setPhotos((prev) => [...prev, newPhoto]);
      setCameraVisible(false);
    },
    [photos.length, showToast]
  );

  const handleDeletePhoto = useCallback(
    async (photoId: string) => {
      const photo = photos.find((p) => p.id === photoId);
      if (!photo) return;

      // Remove from local state immediately
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));

      // If photo was saved to DB, delete from defect_photos table and storage
      if (photo.dbId) {
        try {
          await supabase.from('defect_photos').delete().eq('id', photo.dbId);
        } catch {
          // Photo already removed from UI — log silently
          // Photo record deletion failed silently — already removed from UI
        }
      }

      if (photo.storagePath) {
        try {
          await supabase.storage
            .from('defect-photos')
            .remove([photo.storagePath]);
        } catch {
          // Storage deletion failed silently — not critical
        }
      }
    },
    [photos]
  );

  const handleSave = useCallback(async () => {
    if (!canSave || !reportId || !organizationId) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsSaving(true);
    try {
      // Insert the defect
      const { data: defectData, error: defectError } = await supabase
        .from('defects')
        .insert({
          delivery_report_id: reportId,
          organization_id: organizationId,
          description,
          room: location || null,
          category: category || null,
          severity: 'medium',
          source: 'manual',
        })
        .select('id')
        .single();

      if (defectError || !defectData) {
        showToast('שגיאה בשמירת הממצא', 'error');
        return;
      }

      const defectId = defectData.id as string;

      // Insert photo records into defect_photos
      if (photos.length > 0) {
        const photoRows = photos.map((photo, index) => ({
          defect_id: defectId,
          organization_id: organizationId,
          image_url: photo.publicUrl ?? '',
          sort_order: index,
        }));

        const { error: photosError } = await supabase
          .from('defect_photos')
          .insert(photoRows);

        if (photosError) {
          // Defect saved but photos failed — notify but don't block
          showToast('הממצא נשמר, אך חלק מהתמונות לא נשמרו', 'error');
        }
      }

      savedRef.current = true;
      showToast('הממצא נשמר בהצלחה', 'success');
      router.back();
    } catch {
      showToast('שגיאה בשמירת הממצא', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [
    canSave,
    reportId,
    organizationId,
    description,
    location,
    category,
    photos,
    router,
    showToast,
  ]);

  const locationLabels = ROOM_TYPES.map((r) => r.label);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.cream[50],
      }}
    >
      <StatusBar style="dark" />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onDismiss={hideToast}
        />
      )}

      {/* Camera Modal */}
      <CameraCapture
        visible={cameraVisible}
        onCapture={handleCameraCapture}
        onClose={() => setCameraVisible(false)}
        organizationId={organizationId}
        reportId={reportId ?? ''}
      />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 8,
          backgroundColor: COLORS.cream[50],
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
        }}
      >
        {/* Progress bar */}
        <View
          style={{
            height: 3,
            borderRadius: 2,
            backgroundColor: COLORS.cream[200],
            overflow: 'hidden',
            marginBottom: 8,
          }}
        >
          <View
            style={{
              height: '100%',
              borderRadius: 2,
              backgroundColor: COLORS.primary[500],
              width: `${(filledCount / totalFields) * 100}%`,
            }}
          />
        </View>

        {/* Title row */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: '700',
                color: COLORS.neutral[800],
                fontFamily: 'Rubik-Bold',
              }}
            >
              הוספת ממצא
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: COLORS.neutral[400],
                fontFamily: 'Rubik-Regular',
              }}
            >
              {filledCount}/{totalFields}
            </Text>
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                backgroundColor: COLORS.cream[100],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="x" size={20} color={COLORS.neutral[500]} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. Category */}
          <FormField label="קטגוריה" required filled={!!category} icon="grid">
            <CategoryPicker selected={category} onSelect={setCategory} />
          </FormField>

          {/* 2. Description */}
          <FormField
            label="תיאור הממצא"
            required
            filled={!!description}
            icon="alert-triangle"
          >
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="תאר את הממצא..."
              placeholderTextColor={COLORS.neutral[400]}
              multiline
              style={{
                paddingVertical: 9,
                paddingHorizontal: 12,
                borderRadius: BORDER_RADIUS.md,
                borderWidth: 1,
                borderColor: description
                  ? COLORS.primary[200]
                  : COLORS.cream[300],
                backgroundColor: description
                  ? COLORS.primary[50]
                  : COLORS.cream[50],
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[800],
                textAlign: 'right',
                minHeight: 42,
                maxHeight: 100,
              }}
            />
          </FormField>

          {/* 3. Location */}
          <FormField label="מיקום" filled={!!location} icon="map-pin">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row-reverse',
                gap: 6,
                paddingVertical: 2,
              }}
            >
              {locationLabels.map((loc) => {
                const isSelected = location === loc;
                return (
                  <Pressable
                    key={loc}
                    onPress={() => setLocation(isSelected ? '' : loc)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: isSelected
                        ? COLORS.primary[500]
                        : 'transparent',
                      borderWidth: 1,
                      borderColor: isSelected
                        ? COLORS.primary[500]
                        : COLORS.cream[300],
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: isSelected ? '600' : '400',
                        color: isSelected ? '#FFFFFF' : COLORS.neutral[600],
                        fontFamily: isSelected
                          ? 'Rubik-SemiBold'
                          : 'Rubik-Regular',
                      }}
                    >
                      {loc}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </FormField>

          {/* Separator */}
          <View
            style={{
              height: 1,
              backgroundColor: COLORS.cream[200],
              marginVertical: 4,
            }}
          />

          {/* 4. Recommendation */}
          <FormField label="המלצה לתיקון" filled={!!recommendation} icon="tool">
            <TextInput
              value={recommendation}
              onChangeText={setRecommendation}
              placeholder="המלצת תיקון..."
              placeholderTextColor={COLORS.neutral[400]}
              multiline
              style={{
                paddingVertical: 9,
                paddingHorizontal: 12,
                borderRadius: BORDER_RADIUS.md,
                borderWidth: 1,
                borderColor: recommendation
                  ? COLORS.primary[200]
                  : COLORS.cream[300],
                backgroundColor: recommendation
                  ? COLORS.primary[50]
                  : COLORS.cream[50],
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[800],
                textAlign: 'right',
                minHeight: 42,
                maxHeight: 80,
              }}
            />
          </FormField>

          {/* 5. Cost */}
          <FormField
            label="עלות תיקון"
            filled={!!(costAmount || costQty)}
            icon="file-text"
          >
            <CostSection
              costUnit={costUnit}
              onCostUnitChange={setCostUnit}
              costAmount={costAmount}
              onCostAmountChange={setCostAmount}
              costQty={costQty}
              onCostQtyChange={setCostQty}
              costPerUnit={costPerUnit}
              onCostPerUnitChange={setCostPerUnit}
            />
          </FormField>

          {/* 6. Notes */}
          <FormField label="הערות" filled={!!note} icon="message-square">
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="הערות נוספות (אופציונלי)..."
              placeholderTextColor={COLORS.neutral[400]}
              multiline
              numberOfLines={2}
              style={{
                paddingVertical: 9,
                paddingHorizontal: 12,
                borderRadius: BORDER_RADIUS.md,
                borderWidth: 1,
                borderColor: note ? COLORS.primary[200] : COLORS.cream[300],
                backgroundColor: note ? COLORS.primary[50] : COLORS.cream[50],
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[800],
                textAlign: 'right',
                minHeight: 56,
              }}
            />
          </FormField>

          {/* 7. Photos */}
          <FormField
            label={`תמונות${photos.length > 0 ? ` (${photos.length})` : ''}`}
            filled={photos.length > 0}
            icon="camera"
          >
            <PhotoGrid
              photos={photos}
              onAddPhoto={handleAddPhoto}
              onDeletePhoto={handleDeletePhoto}
            />
          </FormField>

          {/* 8. Attachment */}
          <FormField label="נספח (צילום מהתקן)" icon="paperclip">
            <Pressable
              style={({ pressed }) => ({
                width: '100%',
                paddingVertical: 10,
                borderRadius: BORDER_RADIUS.md,
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: pressed
                  ? COLORS.primary[500]
                  : COLORS.primary[200],
                backgroundColor: pressed
                  ? COLORS.primary[100]
                  : COLORS.primary[50],
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              })}
            >
              <Feather name="paperclip" size={16} color={COLORS.primary[500]} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: COLORS.primary[500],
                  fontFamily: 'Rubik-Medium',
                }}
              >
                הוסף נספח
              </Text>
            </Pressable>
          </FormField>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save button */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: Math.max(20, insets.bottom),
          borderTopWidth: 1,
          borderTopColor: COLORS.cream[200],
          backgroundColor: COLORS.cream[50],
        }}
      >
        <Button
          label="שמור ממצא"
          onPress={handleSave}
          disabled={!canSave}
          loading={isSaving}
          size="lg"
        />
      </View>
    </View>
  );
}
