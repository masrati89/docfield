import { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';

import * as ImagePicker from 'expo-image-picker';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import {
  ROOM_TYPES,
  DEFECT_CATEGORIES,
  DEFECT_SEVERITIES,
} from '@infield/shared';
import { createDefectSchema } from '@infield/shared/src/validation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useReport } from '@/hooks/useReport';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui';
import { CameraCapture } from '@/components/camera';
import type { CapturedPhoto } from '@/lib/annotations';
import type { AnnotationLayer } from '@/lib/annotations';

import { useDefectLibrary } from '@/hooks/useDefectLibrary';
import { useDefectForm } from '@/hooks/useDefectForm';
import { useDefectPhotos } from '@/hooks/useDefectPhotos';
import { useDefectLibrarySuggestions } from '@/hooks/useDefectLibrarySuggestions';
import { useDefectSave } from '@/hooks/useDefectSave';

import {
  FormField,
  ComboField,
  CostSection,
  PhotoGrid,
  AppendixSection,
} from '@/components/defect';

import type { PhotoItem } from '@/components/defect/PhotoGrid';

// --- Constants ---

const MAX_PHOTOS = 20;

const _RECOMMENDATION_SUGGESTIONS = [
  'החלפת אטם',
  'פירוק סיפון וניקוי',
  'החלפת אריח',
  'החלפת ידית/צילינדר',
  'הרחבת טיח ומילוי מחדש',
  'תיקון שיפוע ניקוז',
];

// --- Screen ---

export default function AddDefectScreen() {
  const {
    id: reportId,
    category: initialCategory,
    templateId,
  } = useLocalSearchParams<{
    id: string;
    category?: string;
    templateId?: string;
  }>();

  // Web fallback: extract id from URL path (pathname or hash) if not in params
  const finalReportId =
    reportId ||
    (typeof window !== 'undefined'
      ? window.location.pathname.match(/\/reports\/([^/]+)/)?.[1] ||
        window.location.hash.match(/\/reports\/([^/]+)/)?.[1]
      : undefined);

  // Template loading state
  const [templateData, setTemplateData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(!!templateId);

  useEffect(() => {
    if (!templateId) {
      setIsLoadingTemplate(false);
      return;
    }

    const fetchTemplate = async () => {
      try {
        const { data, error } = await supabase
          .from('defect_library')
          .select(
            'id, title, description, category, location, standard_ref, recommendation, unit_price'
          )
          .eq('id', templateId)
          .single();

        if (error) throw error;
        if (data) {
          setTemplateData({
            description: data.description || '',
            category: data.category || '',
            location: data.location || '',
            standardRef: data.standard_ref || '',
            recommendation: data.recommendation || '',
            costAmount: data.unit_price ? String(data.unit_price) : '',
          });
        }
      } catch (err) {
        if (__DEV__) {
          console.error('[AddDefect] template fetch error:', err);
        }
      } finally {
        setIsLoadingTemplate(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  // Report data — detect mode (bedek_bait vs delivery)
  const { report: reportInfo } = useReport(finalReportId);
  const reportType = reportInfo?.reportType ?? 'bedek_bait';
  const isDelivery = reportType === 'delivery';
  const showSeverity = reportInfo?.showSeverity ?? true;

  // Apartment/room context for breadcrumb
  const apartmentNumber = reportInfo?.apartmentNumber ?? '';
  const roomLabel = initialCategory ?? '';

  const organizationId = profile?.organizationId ?? '';

  // Defect library for autocomplete suggestions
  const { allItems: libraryItems, addItem, isAdding } = useDefectLibrary();

  // Migrated hooks
  const form = useDefectForm(
    initialCategory,
    templateData as Record<string, string> | undefined,
    isLoadingTemplate
  );
  const photos = useDefectPhotos({ showToast });
  const library = useDefectLibrarySuggestions({
    description: form.description,
    category: form.category,
    location: form.location,
    standardRef: form.standardRef,
    recommendation: form.recommendation,
    costAmount: form.costAmount,
    costUnit: form.costUnit,
    note: form.note,
    defaultPrice: form.defaultPrice,
    standardDescMap: form.standardDescMap,
    setDescription: form.setDescription,
    setCategory: form.setCategory,
    setLocation: form.setLocation,
    setStandardRef: form.setStandardRef,
    setStandardDisplay: form.setStandardDisplay,
    setRecommendation: form.setRecommendation,
    setDefaultPrice: form.setDefaultPrice,
    setCostAmount: form.setCostAmount,
    setEntrySource: form.setEntrySource,
    libraryItems,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addItem: addItem as any,
    isAdding,
    showToast,
  });
  const save = useDefectSave({
    reportId: finalReportId ?? '',
    organizationId,
    form,
    photos: photos.photos,
    showToast,
    isDirty: form.isDirty,
  });

  // Modal state (specific to this component)
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const handlePickFromGallery = useCallback(async () => {
    if (photos.photos.length >= MAX_PHOTOS) {
      showToast('ניתן להוסיף עד 20 תמונות', 'error');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast('נדרשת גישה לספריית התמונות כדי להוסיף תמונות', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.photos.length,
    });

    if (result.canceled || !result.assets) return;

    const newPhotos: PhotoItem[] = result.assets.map((asset, i) => ({
      id: String(Date.now() + i),
      localUri: asset.uri,
      publicUrl: asset.uri,
      isUploading: false,
    }));

    photos.setPhotos((prev: PhotoItem[]) =>
      [...prev, ...newPhotos].slice(0, MAX_PHOTOS)
    );
  }, [photos, showToast]);

  const handlePhotosConfirmed = useCallback(
    (captured: CapturedPhoto[]) => {
      const newPhotos: PhotoItem[] = captured.map((photo, i) => ({
        id: String(Date.now() + i),
        localUri: photo.uri,
        isUploading: false,
        annotations: photo.annotations,
      }));
      photos.setPhotos((prev: PhotoItem[]) =>
        [...prev, ...newPhotos].slice(0, MAX_PHOTOS)
      );
      photos.setCameraVisible(false);
    },
    [photos]
  );

  const handleUpdateAnnotations = useCallback(
    (photoId: string, annotations: AnnotationLayer) => {
      photos.setPhotos((prev: PhotoItem[]) =>
        prev.map((p: PhotoItem) =>
          p.id === photoId ? { ...p, annotations } : p
        )
      );
    },
    [photos]
  );

  const handleUpdateCaption = useCallback(
    (photoId: string, caption: string) => {
      photos.setPhotos((prev: PhotoItem[]) =>
        prev.map((p: PhotoItem) => (p.id === photoId ? { ...p, caption } : p))
      );
    },
    [photos]
  );

  const handleDeletePhoto = useCallback(
    async (photoId: string) => {
      const photo = photos.photos.find((p) => p.id === photoId);
      if (!photo) return;

      // Remove from local state immediately
      photos.setPhotos((prev: PhotoItem[]) =>
        prev.filter((p: PhotoItem) => p.id !== photoId)
      );

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
    if (!form.canSave) {
      showToast('יש למלא תיאור וקטגוריה', 'error');
      return;
    }
    if (!finalReportId || !organizationId) {
      showToast('שגיאה בטעינת הדוח. נסה לצאת ולהיכנס מחדש', 'error');
      return;
    }
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      // Zod validation before Supabase insert (security M1)
      const validation = createDefectSchema.safeParse({
        deliveryReportId: finalReportId,
        description: form.description.trim(),
        room: form.location || '',
        category: form.category || '',
        severity: form.severity,
        standardRef: form.standardRef.trim() || undefined,
        standardSection: form.standardSection.trim() || undefined,
        recommendation: form.recommendation.trim() || undefined,
        notes: form.note.trim() || undefined,
        cost: form.costAmount
          ? parseFloat(form.costAmount.replace(/,/g, ''))
          : undefined,
        costUnit: form.costUnit || undefined,
      });

      if (!validation.success) {
        const firstError =
          validation.error.errors[0]?.message ?? 'שגיאה בנתונים';
        showToast(firstError, 'error');
        return;
      }

      // Compute cost fields based on cost unit type
      const isFixedCost = form.costUnit === 'fixed';
      const parsedAmount = form.costAmount
        ? parseFloat(form.costAmount.replace(/,/g, ''))
        : null;
      const parsedUnitPrice = form.costPerUnit
        ? parseFloat(form.costPerUnit.replace(/,/g, ''))
        : null;
      const parsedQty = form.costQty
        ? parseFloat(form.costQty.replace(/,/g, ''))
        : null;

      const costValue = isFixedCost
        ? parsedAmount
        : parsedUnitPrice && parsedQty
          ? parsedUnitPrice * parsedQty
          : null;

      const { data: defectData, error: defectError } = await supabase
        .from('defects')
        .insert({
          delivery_report_id: finalReportId,
          organization_id: organizationId,
          description: form.description,
          room: form.location || null,
          category: form.category || null,
          standard_ref: form.standardRef.trim() || null,
          standard_section: form.standardSection.trim() || null,
          severity: form.severity,
          library_template_id: templateId || null,
          recommendation: form.recommendation.trim() || null,
          notes: form.note.trim() || null,
          cost: costValue,
          cost_unit: costValue !== null ? form.costUnit : null,
          unit_price: !isFixedCost ? parsedUnitPrice : null,
          quantity: !isFixedCost ? parsedQty : null,
          unit_label: !isFixedCost && costValue !== null ? form.costUnit : null,
        })
        .select('id')
        .single();

      if (defectError || !defectData) {
        if (__DEV__) {
          console.error('[AddDefect] insert error:', defectError?.message);
        }
        showToast(defectError?.message ?? 'שגיאה בשמירת הממצא', 'error');
        return;
      }

      const defectId = defectData.id as string;

      // Upload and insert photo records into defect_photos
      if (photos.photos.length > 0) {
        for (let i = 0; i < photos.photos.length; i++) {
          const photo = photos.photos[i];
          let imageUrl = photo.publicUrl ?? '';

          // Upload local photos that don't have a publicUrl yet
          if (photo.localUri && !photo.publicUrl) {
            try {
              const uuid = String(Date.now()) + '_' + i;
              const filePath = `${organizationId}/${finalReportId}/${uuid}.jpg`;
              const response = await fetch(photo.localUri);
              const blob = await response.blob();

              const { error: uploadError } = await supabase.storage
                .from('defect-photos')
                .upload(filePath, blob, {
                  contentType: 'image/jpeg',
                  upsert: false,
                });

              if (uploadError) throw uploadError;

              const { data: signedData, error: signedError } =
                await supabase.storage
                  .from('defect-photos')
                  .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

              if (signedError || !signedData?.signedUrl) {
                throw signedError ?? new Error('Failed to create signed URL');
              }

              imageUrl = signedData.signedUrl;
            } catch {
              showToast('חלק מהתמונות לא הועלו', 'error');
              continue;
            }
          }

          const { error: insertError } = await supabase
            .from('defect_photos')
            .insert({
              defect_id: defectId,
              organization_id: organizationId,
              image_url: imageUrl,
              sort_order: i,
              annotations_json: photo.annotations ?? null,
              caption: photo.caption?.trim() || null,
            });

          if (insertError) {
            showToast('הממצא נשמר, אך חלק מהתמונות לא נשמרו', 'error');
          }
        }
      }

      showToast('הממצא נשמר בהצלחה', 'success');
      save.closeModal();
    } catch {
      showToast('שגיאה בשמירת הממצא', 'error');
    }
  }, [
    form.canSave,
    finalReportId,
    organizationId,
    form.description,
    form.location,
    form.category,
    form.severity,
    form.standardRef,
    form.standardSection,
    form.recommendation,
    form.note,
    form.costAmount,
    form.costUnit,
    form.costPerUnit,
    form.costQty,
    templateId,
    photos.photos,
    save,
    showToast,
  ]);

  const locationLabels = ROOM_TYPES.map((r) => r.label);

  const screenHeight = Dimensions.get('window').height;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent',
      }}
    >
      <StatusBar style="light" />

      {/* Dimmed overlay — tap to dismiss */}
      <Pressable
        onPress={() => {
          if (save.isSaving) return;
          if (!form.isDirty) {
            save.closeModal();
          } else {
            setConfirmAction({
              title: 'שינויים שלא נשמרו',
              message: 'יש שינויים שלא נשמרו. לצאת בלי לשמור?',
              onConfirm: () => save.closeModal(),
            });
          }
        }}
        style={{
          height: screenHeight * 0.1,
          backgroundColor: 'rgba(0,0,0,0.35)',
        }}
      />

      {/* Sheet body */}
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.cream[50],
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden',
        }}
      >
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
          visible={photos.cameraVisible}
          onClose={() => photos.setCameraVisible(false)}
          onPhotosConfirmed={handlePhotosConfirmed}
          initialPhotoCount={photos.photos.length}
          maxPhotos={MAX_PHOTOS}
        />

        {/* Grabber */}
        <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: COLORS.cream[300],
            }}
          />
        </View>

        {/* Loading state — block form while template fetches */}
        {isLoadingTemplate && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator size="large" color={COLORS.primary[500]} />
          </View>
        )}

        {!isLoadingTemplate && (
          <>
            {/* Header — DS: breadcrumb + title + close button */}
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 12,
                paddingTop: 6,
                paddingHorizontal: 16,
                paddingBottom: 12,
                backgroundColor: COLORS.cream[50],
                borderBottomWidth: 1,
                borderBottomColor: COLORS.cream[200],
              }}
            >
              <View style={{ flex: 1 }}>
                {isDelivery || apartmentNumber || roomLabel ? (
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'Rubik-Regular',
                      color: COLORS.neutral[400],
                      textAlign: 'right',
                      marginBottom: 2,
                    }}
                  >
                    {[
                      isDelivery ? 'פרוטוקול מסירה' : '',
                      apartmentNumber ? `דירה ${apartmentNumber}` : '',
                      roomLabel,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                ) : null}
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: COLORS.neutral[800],
                    fontFamily: 'Rubik-Bold',
                    letterSpacing: -0.2,
                    textAlign: 'right',
                  }}
                >
                  ממצא חדש
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  if (save.isSaving) return;
                  if (!form.isDirty) {
                    save.closeModal();
                  } else {
                    setConfirmAction({
                      title: 'שינויים שלא נשמרו',
                      message: 'יש שינויים שלא נשמרו. לצאת בלי לשמור?',
                      onConfirm: () => save.closeModal(),
                    });
                  }
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: COLORS.cream[100],
                  borderWidth: 1,
                  borderColor: COLORS.cream[200],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="x" size={18} color={COLORS.neutral[600]} />
              </Pressable>
            </View>

            {/* Form */}
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <ScrollView
                contentContainerStyle={{
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  paddingBottom: 20,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* 1. Category — search + chip grid */}
                <View style={{ marginBottom: 16 }}>
                  <FormField
                    label="קטגוריה"
                    required
                    filled={!!form.category}
                    icon="grid"
                  >
                    {/* Search / add input */}
                    <View
                      style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: form.categorySearch
                          ? COLORS.primary[200]
                          : COLORS.cream[300],
                        backgroundColor: COLORS.cream[100],
                        paddingHorizontal: 10,
                        marginBottom: 8,
                        height: 40,
                      }}
                    >
                      <Feather
                        name="search"
                        size={14}
                        color={COLORS.neutral[400]}
                        style={{ marginLeft: 6 }}
                      />
                      <TextInput
                        value={form.categorySearch}
                        onChangeText={form.setCategorySearch}
                        placeholder="חפש או הוסף קטגוריה..."
                        placeholderTextColor={COLORS.neutral[400]}
                        style={{
                          flex: 1,
                          fontSize: 13,
                          fontFamily: 'Rubik-Regular',
                          color: COLORS.neutral[800],
                          textAlign: 'right',
                          paddingVertical: 0,
                        }}
                      />
                      {/* Use as custom category button */}
                      {form.categorySearch.trim().length > 0 &&
                        !DEFECT_CATEGORIES.some(
                          (c) => c.label === form.categorySearch.trim()
                        ) && (
                          <Pressable
                            onPress={() => {
                              form.setCategory(form.categorySearch.trim());
                              if (Platform.OS !== 'web') {
                                Haptics.impactAsync(
                                  Haptics.ImpactFeedbackStyle.Light
                                );
                              }
                            }}
                            style={{
                              flexDirection: 'row-reverse',
                              alignItems: 'center',
                              gap: 3,
                              paddingVertical: 4,
                              paddingHorizontal: 8,
                              borderRadius: 6,
                              backgroundColor: COLORS.primary[50],
                            }}
                          >
                            <Feather
                              name="plus"
                              size={12}
                              color={COLORS.primary[500]}
                            />
                            <Text
                              style={{
                                fontSize: 11,
                                fontFamily: 'Rubik-Medium',
                                color: COLORS.primary[500],
                              }}
                            >
                              הוסף
                            </Text>
                          </Pressable>
                        )}
                    </View>

                    {/* Filtered chips */}
                    <ScrollView
                      style={{ maxHeight: 88 }}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled
                    >
                      <View
                        style={{
                          flexDirection: 'row-reverse',
                          flexWrap: 'wrap',
                          gap: 6,
                        }}
                      >
                        {DEFECT_CATEGORIES.filter(
                          (cat) =>
                            !form.categorySearch.trim() ||
                            cat.label.includes(form.categorySearch.trim())
                        ).map((cat) => {
                          const isSelected = form.category === cat.label;
                          return (
                            <Pressable
                              key={cat.label}
                              onPress={() => {
                                form.setCategory(cat.label);
                                form.setCategorySearch('');
                                if (Platform.OS !== 'web') {
                                  Haptics.impactAsync(
                                    Haptics.ImpactFeedbackStyle.Light
                                  );
                                }
                              }}
                              style={{
                                paddingVertical: 7,
                                paddingHorizontal: 12,
                                borderRadius: 18,
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
                                  fontSize: 12,
                                  fontWeight: isSelected ? '600' : '500',
                                  color: isSelected
                                    ? '#fff'
                                    : COLORS.neutral[600],
                                  fontFamily: isSelected
                                    ? 'Rubik-SemiBold'
                                    : 'Rubik-Medium',
                                }}
                              >
                                {cat.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </ScrollView>
                    <Text
                      style={{
                        fontSize: 10,
                        color: COLORS.neutral[400],
                        fontFamily: 'Rubik-Regular',
                        marginTop: 4,
                        textAlign: 'left',
                      }}
                    >
                      {form.categorySearch.trim()
                        ? `${DEFECT_CATEGORIES.filter((c) => c.label.includes(form.categorySearch.trim())).length} תוצאות`
                        : `${DEFECT_CATEGORIES.length} קטגוריות · גלול לעוד`}
                    </Text>
                  </FormField>
                </View>

                {/* 2. Description — DS: icon alert, g500 */}
                <FormField
                  label="תיאור ממצא"
                  required
                  filled={!!form.description}
                  icon="alert-triangle"
                >
                  <TextInput
                    value={form.description}
                    onChangeText={(text) => {
                      form.setDescription(text);
                      library.setShowSuggestions(true);
                    }}
                    onFocus={() => library.setShowSuggestions(true)}
                    onBlur={() => {
                      // Delay hiding to allow suggestion tap
                      setTimeout(() => library.setShowSuggestions(false), 200);
                    }}
                    placeholder="תאר את הממצא..."
                    placeholderTextColor={COLORS.neutral[400]}
                    multiline
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: BORDER_RADIUS.md,
                      borderWidth: 1,
                      borderColor: form.description
                        ? COLORS.primary[200]
                        : COLORS.cream[300],
                      backgroundColor: form.description
                        ? COLORS.primary[50]
                        : COLORS.cream[50],
                      fontSize: 15,
                      lineHeight: 22,
                      fontFamily: 'Rubik-Regular',
                      color: COLORS.neutral[800],
                      textAlign: 'right',
                      minHeight: 68,
                      maxHeight: 120,
                    }}
                  />

                  {/* Autocomplete suggestions from defect library */}
                  {library.showSuggestions &&
                    library.suggestions.length > 0 && (
                      <View
                        style={{
                          marginTop: 4,
                          borderRadius: BORDER_RADIUS.md,
                          borderWidth: 1,
                          borderColor: COLORS.cream[200],
                          backgroundColor: COLORS.cream[50],
                          overflow: 'hidden',
                        }}
                      >
                        {library.suggestions.map((item) => (
                          <Pressable
                            key={item.id}
                            onPress={() => library.handleSelectSuggestion(item)}
                            style={({ pressed }) => ({
                              paddingVertical: 10,
                              paddingHorizontal: 12,
                              borderBottomWidth: 1,
                              borderBottomColor: COLORS.cream[200],
                              backgroundColor: pressed
                                ? COLORS.primary[50]
                                : 'transparent',
                            })}
                          >
                            {/* Row 1: Title */}
                            <Text
                              style={{
                                fontSize: 13,
                                fontFamily: 'Rubik-Medium',
                                color: COLORS.neutral[800],
                                textAlign: 'right',
                              }}
                              numberOfLines={1}
                            >
                              {item.title}
                            </Text>

                            {/* Row 2: Category badge + location + price badge */}
                            {item.category ||
                            item.location ||
                            item.price !== null ? (
                              <View
                                style={{
                                  flexDirection: 'row-reverse',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: 4,
                                  marginTop: 4,
                                }}
                              >
                                {item.category ? (
                                  <View
                                    style={{
                                      backgroundColor: COLORS.primary[50],
                                      borderRadius: 4,
                                      paddingHorizontal: 6,
                                      paddingVertical: 1,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 10,
                                        fontFamily: 'Rubik-Regular',
                                        color: COLORS.primary[700],
                                      }}
                                    >
                                      {item.category}
                                    </Text>
                                  </View>
                                ) : null}

                                {item.location ? (
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      fontFamily: 'Rubik-Regular',
                                      color: COLORS.neutral[400],
                                    }}
                                  >
                                    {item.location}
                                  </Text>
                                ) : null}

                                {item.price !== null ? (
                                  <View
                                    style={{
                                      backgroundColor: COLORS.gold[100],
                                      borderRadius: 4,
                                      paddingHorizontal: 6,
                                      paddingVertical: 1,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 10,
                                        fontFamily: 'Rubik-Regular',
                                        color: COLORS.gold[700],
                                      }}
                                    >
                                      ₪{item.price.toLocaleString()}
                                    </Text>
                                  </View>
                                ) : null}
                              </View>
                            ) : null}
                          </Pressable>
                        ))}
                      </View>
                    )}

                  {/* Add to Library button */}
                  {library.showAddToLibrary && !library.showSuggestions && (
                    <Pressable
                      onPress={library.handleAddToLibrary}
                      disabled={isAdding || library.addedToLibrary}
                      style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: BORDER_RADIUS.sm,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        borderColor: library.addedToLibrary
                          ? COLORS.primary[500]
                          : COLORS.primary[300],
                        backgroundColor: library.addedToLibrary
                          ? COLORS.primary[100]
                          : COLORS.primary[50],
                        marginTop: 8,
                        opacity: isAdding ? 0.6 : 1,
                      }}
                    >
                      <Feather
                        name={
                          library.addedToLibrary
                            ? 'check-circle'
                            : 'plus-circle'
                        }
                        size={14}
                        color={COLORS.primary[500]}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: COLORS.primary[500],
                          fontFamily: 'Rubik-Medium',
                        }}
                      >
                        {library.addedToLibrary ? 'נוסף!' : 'הוסף למאגר'}
                      </Text>
                    </Pressable>
                  )}
                </FormField>

                {/* 3. Location */}
                <FormField
                  label="מיקום"
                  filled={!!form.location}
                  icon="map-pin"
                >
                  <ComboField
                    value={form.location}
                    onSelect={form.setLocation}
                    options={locationLabels}
                    placeholder="הקלד או בחר מיקום..."
                    allowCustom
                  />
                </FormField>

                {/* 3.5 Severity picker */}
                {showSeverity && (
                  <FormField
                    label="רמת דחיפות"
                    filled={!!form.severity}
                    icon="alert-triangle"
                  >
                    <View
                      style={{
                        flexDirection: 'row-reverse',
                        gap: 8,
                        paddingVertical: 4,
                      }}
                    >
                      {DEFECT_SEVERITIES.map((sev) => {
                        const isSelected = form.severity === sev.value;
                        return (
                          <Pressable
                            key={sev.value}
                            onPress={() => {
                              form.setSeverity(sev.value);
                              if (Platform.OS !== 'web') {
                                Haptics.impactAsync(
                                  Haptics.ImpactFeedbackStyle.Light
                                );
                              }
                            }}
                            style={{
                              flex: 1,
                              paddingVertical: 8,
                              borderRadius: BORDER_RADIUS.md,
                              borderWidth: isSelected ? 2 : 1,
                              borderColor: isSelected
                                ? sev.color
                                : COLORS.cream[200],
                              backgroundColor: isSelected
                                ? sev.backgroundColor
                                : COLORS.cream[50],
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: isSelected
                                  ? 'Rubik-SemiBold'
                                  : 'Rubik-Regular',
                                color: isSelected
                                  ? sev.textColor
                                  : COLORS.neutral[500],
                              }}
                            >
                              {sev.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </FormField>
                )}

                {/* 4. Israeli Standard — bedek_bait only */}
                {!isDelivery && (
                  <FormField
                    label="תקן"
                    filled={!!form.standardRef}
                    icon="book"
                    labelExtra={
                      form.standardRef.trim() ? (
                        <Text
                          style={{
                            fontSize: 11,
                            color: COLORS.primary[700],
                            backgroundColor: COLORS.primary[50],
                            paddingVertical: 1,
                            paddingHorizontal: 6,
                            borderRadius: 4,
                            fontFamily: 'Inter-Regular',
                            fontWeight: '500',
                            overflow: 'hidden',
                          }}
                        >
                          {form.standardRef.split(' סעיף ')[0] ||
                            form.standardRef}
                        </Text>
                      ) : undefined
                    }
                    hint={
                      form.entrySource === 'library' ? 'מהספרייה' : undefined
                    }
                  >
                    <ComboField
                      value={form.standardRef}
                      onSelect={form.handleSelectStandard}
                      options={form.standardOptions}
                      placeholder="חפש תקן ישראלי..."
                      allowCustom
                    />
                    {form.standardDisplay ? (
                      <View
                        style={{
                          marginTop: 8,
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: COLORS.primary[200],
                          backgroundColor: COLORS.cream[50],
                          minHeight: 82,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            color: COLORS.neutral[800],
                            fontFamily: 'Rubik-Regular',
                            textAlign: 'right',
                            lineHeight: 19,
                          }}
                        >
                          {form.standardDisplay}
                        </Text>
                      </View>
                    ) : null}
                  </FormField>
                )}

                {/* 5. Recommendation — DS: icon tool g500; delivery: optional with hint */}
                <FormField
                  label="המלצה לתיקון"
                  filled={!!form.recommendation}
                  icon="tool"
                  iconColor={COLORS.primary[500]}
                  labelExtra={
                    isDelivery ? (
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '400',
                          color: COLORS.neutral[400],
                          fontFamily: 'Rubik-Regular',
                        }}
                      >
                        · לא חובה
                      </Text>
                    ) : undefined
                  }
                >
                  <TextInput
                    value={form.recommendation}
                    onChangeText={form.setRecommendation}
                    placeholder={
                      isDelivery
                        ? 'ניתן להשאיר ריק או להוסיף המלצה ליזם/קבלן…'
                        : 'הקלד המלצה לתיקון...'
                    }
                    placeholderTextColor={COLORS.neutral[400]}
                    multiline
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: form.recommendation
                        ? COLORS.primary[200]
                        : COLORS.cream[200],
                      backgroundColor: form.recommendation
                        ? COLORS.cream[50]
                        : COLORS.cream[100],
                      fontSize: 14,
                      lineHeight: 20,
                      fontFamily: 'Rubik-Regular',
                      color: COLORS.neutral[800],
                      textAlign: 'right',
                      minHeight: 92,
                    }}
                  />
                </FormField>

                {/* 6. Cost — bedek_bait only, DS: custom header with ₪ icon */}
                {!isDelivery && (
                  <View style={{ marginBottom: 14 }}>
                    <View
                      style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: COLORS.gold[500],
                          fontWeight: '700',
                          fontFamily: 'Inter-Bold',
                        }}
                      >
                        ₪
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: COLORS.neutral[700],
                          fontFamily: 'Rubik-SemiBold',
                        }}
                      >
                        עלות תיקון משוערת
                      </Text>
                    </View>
                    <CostSection
                      costUnit={form.costUnit}
                      onCostUnitChange={form.setCostUnit}
                      costAmount={form.costAmount}
                      onCostAmountChange={form.setCostAmount}
                      costQty={form.costQty}
                      onCostQtyChange={form.setCostQty}
                      costPerUnit={form.costPerUnit}
                      onCostPerUnitChange={form.setCostPerUnit}
                    />
                  </View>
                )}

                {/* 7. Photos — DS: icon camera n500, count as Inter number */}
                <FormField
                  label="תמונות"
                  filled={photos.photos.length > 0}
                  icon="camera"
                  count={
                    photos.photos.length > 0 ? photos.photos.length : undefined
                  }
                >
                  <PhotoGrid
                    photos={photos.photos}
                    onAddPhoto={photos.handleAddPhoto}
                    onPickFromGallery={handlePickFromGallery}
                    onDeletePhoto={handleDeletePhoto}
                    onUpdateAnnotations={handleUpdateAnnotations}
                    onUpdateCaption={handleUpdateCaption}
                  />
                </FormField>

                {/* 8. Appendix — bedek_bait only, DS: icon file n500 */}
                {!isDelivery && (
                  <FormField
                    label="נספח"
                    filled={photos.appendixDocs.length > 0}
                    icon="file"
                    hint="תקנים ומסמכים"
                    count={
                      photos.appendixDocs.length > 0
                        ? photos.appendixDocs.length
                        : undefined
                    }
                  >
                    <AppendixSection
                      documents={photos.appendixDocs}
                      onAddFromLibrary={() => {
                        // Placeholder — library picker not yet implemented
                      }}
                      onAddFromCamera={() => {
                        // Placeholder — camera capture for appendix not yet implemented
                      }}
                      onDelete={(id: string) =>
                        photos.setAppendixDocs(
                          (prev: { id: string; uri: string }[]) =>
                            prev.filter(
                              (d: { id: string; uri: string }) => d.id !== id
                            )
                        )
                      }
                    />
                  </FormField>
                )}

                {/* 9. Notes — DS: muted, icon file n500 */}
                <FormField label="הערות" filled={!!form.note} icon="file" muted>
                  <TextInput
                    value={form.note}
                    onChangeText={form.setNote}
                    placeholder="הערות פנימיות, תזכורות לעצמך, תיאום עם הדייר…"
                    placeholderTextColor={COLORS.neutral[400]}
                    multiline
                    numberOfLines={2}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: form.note
                        ? COLORS.primary[200]
                        : COLORS.cream[200],
                      backgroundColor: form.note
                        ? COLORS.cream[50]
                        : COLORS.cream[100],
                      fontSize: 13,
                      lineHeight: 19,
                      fontFamily: 'Rubik-Regular',
                      color: COLORS.neutral[800],
                      textAlign: 'right',
                      minHeight: 72,
                    }}
                  />
                </FormField>
              </ScrollView>
            </KeyboardAvoidingView>

            {/* Footer — DS: shadow up, single green button */}
            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 10,
                paddingBottom: Math.max(22, insets.bottom),
                borderTopWidth: 1,
                borderTopColor: COLORS.cream[200],
                backgroundColor: COLORS.cream[50],
                boxShadow: '0 -4px 20px rgba(60,54,42,.12)',
              }}
            >
              <Pressable
                onPress={handleSave}
                disabled={!form.canSave || save.isSaving}
                style={{
                  height: 46,
                  borderRadius: 10,
                  backgroundColor: COLORS.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: form.canSave && !save.isSaving ? 1 : 0.5,
                  boxShadow: '0 2px 8px rgba(27,122,68,.18)',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#fff',
                    fontFamily: 'Rubik-SemiBold',
                  }}
                >
                  {save.isSaving ? 'שומר...' : 'שמור ממצא'}
                </Text>
              </Pressable>
            </View>

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
                        אישור
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setConfirmAction(null)}
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
                        ביטול
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              </Pressable>
            </Modal>
          </>
        )}
      </View>
    </View>
  );
}
