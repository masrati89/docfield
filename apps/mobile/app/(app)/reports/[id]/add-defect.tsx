import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

import * as ImagePicker from 'expo-image-picker';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import {
  ROOM_TYPES,
  DEFECT_CATEGORIES,
  ISRAELI_STANDARDS,
} from '@infield/shared';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Button, Toast } from '@/components/ui';
import { CameraCapture } from '@/components/camera';
import type { CapturedPhoto } from '@/lib/annotations';
import type { AnnotationLayer } from '@/lib/annotations';

import { useDefectLibrary } from '@/hooks/useDefectLibrary';
import {
  FormField,
  ComboField,
  CostSection,
  PhotoGrid,
} from '@/components/defect';

import type { PhotoItem } from '@/components/defect/PhotoGrid';

// --- Constants ---

const MAX_PHOTOS = 20;

const RECOMMENDATION_SUGGESTIONS = [
  'החלפת אטם',
  'פירוק סיפון וניקוי',
  'החלפת אריח',
  'החלפת ידית/צילינדר',
  'הרחבת טיח ומילוי מחדש',
  'תיקון שיפוע ניקוז',
];

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
  const [standardRef, setStandardRef] = useState('');
  const [standardDisplay, setStandardDisplay] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [costUnit, setCostUnit] = useState('fixed');
  const [costAmount, setCostAmount] = useState('');
  const [costQty, setCostQty] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [note, setNote] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [entrySource, setEntrySource] = useState<'direct' | 'library'>(
    'direct'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const savedRef = useRef(false);

  const organizationId = profile?.organizationId ?? '';

  // Defect library for autocomplete suggestions
  const { allItems: libraryItems, addItem, isAdding } = useDefectLibrary();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addedToLibrary, setAddedToLibrary] = useState(false);

  const suggestions = useMemo(() => {
    // Start with items filtered by selected category (if any)
    let pool = libraryItems;
    if (category) {
      pool = pool.filter((item) => item.category === category);
    }

    // If no text yet, show all items for this category (up to 10)
    if (!description.trim()) {
      return pool.slice(0, 10);
    }

    // Filter by typed text
    const query = description.trim().toLowerCase();
    return pool
      .filter((item) => item.title.toLowerCase().includes(query))
      .slice(0, 10);
  }, [description, libraryItems, category]);

  // Build a lookup map for standard descriptions (used by suggestion + standard picker)
  const standardDescMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const std of ISRAELI_STANDARDS) {
      for (const sec of std.sections) {
        const key = `${std.name} סעיף ${sec.code} — ${sec.title}`;
        map.set(key, sec.desc);
      }
    }
    return map;
  }, []);

  const handleSelectSuggestion = useCallback(
    (item: (typeof libraryItems)[0]) => {
      setDescription(item.title);
      if (item.category && !category) setCategory(item.category);
      if (item.location && !location) setLocation(item.location);
      if (item.standardRef && !standardRef) {
        setStandardRef(item.standardRef);
        setStandardDisplay(standardDescMap.get(item.standardRef) ?? '');
      }
      if (item.recommendation && !recommendation)
        setRecommendation(item.recommendation);
      setShowSuggestions(false);
      setEntrySource('library');
    },
    [category, location, standardRef, recommendation, standardDescMap]
  );

  // "Add to Library" handler
  const handleAddToLibrary = useCallback(async () => {
    if (!description.trim() || isAdding) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      await addItem({
        title: description.trim(),
        category: category || '',
        location: location || '',
        standardRef: standardRef.trim() || null,
        recommendation: recommendation.trim() || null,
        cost: costAmount ? parseFloat(costAmount) : null,
        costUnit: costUnit || null,
        notes: note.trim() || null,
      });
      setAddedToLibrary(true);
      showToast('נוסף למאגר בהצלחה', 'success');
      setTimeout(() => setAddedToLibrary(false), 2000);
    } catch {
      showToast('שגיאה בהוספה למאגר', 'error');
    }
  }, [
    description,
    category,
    location,
    standardRef,
    recommendation,
    costAmount,
    costUnit,
    note,
    isAdding,
    addItem,
    showToast,
  ]);

  // Show "Add to Library" when description has text and no exact match in library
  const showAddToLibrary = useMemo(() => {
    if (!description.trim() || description.trim().length < 2) return false;
    const query = description.trim().toLowerCase();
    return !libraryItems.some((item) => item.title.toLowerCase() === query);
  }, [description, libraryItems]);

  // Dirty check — warn if user tries to leave with unsaved changes
  // Exclude initialCategory from dirty check since it's pre-filled
  const isDirty =
    (!!category && category !== (initialCategory ?? '')) ||
    !!description.trim() ||
    !!location ||
    !!standardRef.trim() ||
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
    standardRef,
    recommendation,
    costAmount || costQty,
    note,
    photos.length > 0,
  ].filter(Boolean).length;
  const totalFields = 8;
  const canSave = !!category && description.trim().length > 0;

  const handleAddPhoto = useCallback(() => {
    if (photos.length >= MAX_PHOTOS) {
      showToast('ניתן להוסיף עד 20 תמונות', 'error');
      return;
    }
    setCameraVisible(true);
  }, [photos.length, showToast]);

  const handlePickFromGallery = useCallback(async () => {
    if (photos.length >= MAX_PHOTOS) {
      showToast('ניתן להוסיף עד 20 תמונות', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
    });

    if (result.canceled || !result.assets) return;

    const newPhotos: PhotoItem[] = result.assets.map((asset, i) => ({
      id: String(Date.now() + i),
      localUri: asset.uri,
      publicUrl: asset.uri,
      isUploading: false,
    }));

    setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS));
  }, [photos.length, showToast]);

  const handlePhotosConfirmed = useCallback((captured: CapturedPhoto[]) => {
    const newPhotos: PhotoItem[] = captured.map((photo, i) => ({
      id: String(Date.now() + i),
      localUri: photo.uri,
      isUploading: false,
      annotations: photo.annotations,
    }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS));
    setCameraVisible(false);
  }, []);

  const handleUpdateAnnotations = useCallback(
    (photoId: string, annotations: AnnotationLayer) => {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, annotations } : p))
      );
    },
    []
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
          standard_reference: standardRef.trim() || null,
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

      // Upload and insert photo records into defect_photos
      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          let imageUrl = photo.publicUrl ?? '';

          // Upload local photos that don't have a publicUrl yet
          if (photo.localUri && !photo.publicUrl) {
            try {
              const uuid = String(Date.now()) + '_' + i;
              const filePath = `${organizationId}/${reportId}/${uuid}.jpg`;
              const response = await fetch(photo.localUri);
              const blob = await response.blob();

              const { error: uploadError } = await supabase.storage
                .from('defect-photos')
                .upload(filePath, blob, {
                  contentType: 'image/jpeg',
                  upsert: false,
                });

              if (uploadError) throw uploadError;

              const {
                data: { publicUrl },
              } = supabase.storage.from('defect-photos').getPublicUrl(filePath);

              imageUrl = publicUrl;
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
            });

          if (insertError) {
            showToast('הממצא נשמר, אך חלק מהתמונות לא נשמרו', 'error');
          }
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
    standardRef,
    photos,
    router,
    showToast,
  ]);

  const locationLabels = ROOM_TYPES.map((r) => r.label);

  // Build flattened standard options for ComboField
  const standardOptions = useMemo(() => {
    return ISRAELI_STANDARDS.flatMap((std) =>
      std.sections.map((sec) => `${std.name} סעיף ${sec.code} — ${sec.title}`)
    );
  }, []);

  const handleSelectStandard = useCallback(
    (value: string) => {
      setStandardRef(value);
      setStandardDisplay(standardDescMap.get(value) ?? '');
    },
    [standardDescMap]
  );

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
        onClose={() => setCameraVisible(false)}
        onPhotosConfirmed={handlePhotosConfirmed}
        initialPhotoCount={photos.length}
        maxPhotos={MAX_PHOTOS}
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
            {entrySource === 'library' && (
              <View
                style={{
                  backgroundColor: COLORS.gold[100],
                  borderRadius: BORDER_RADIUS.sm,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderWidth: 1,
                  borderColor: COLORS.gold[300],
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: COLORS.gold[700],
                    fontFamily: 'Rubik-Medium',
                  }}
                >
                  מהמאגר
                </Text>
              </View>
            )}
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
              onPress={() => {
                // If filled from library, first press resets form back to direct entry
                if (entrySource === 'library') {
                  setCategory(initialCategory ?? '');
                  setDescription('');
                  setLocation('');
                  setStandardRef('');
                  setStandardDisplay('');
                  setRecommendation('');
                  setCostUnit('fixed');
                  setCostAmount('');
                  setCostQty('');
                  setCostPerUnit('');
                  setNote('');
                  setPhotos([]);
                  setEntrySource('direct');
                  return;
                }
                if (!isDirty || savedRef.current) {
                  savedRef.current = true;
                  router.back();
                } else {
                  Alert.alert(
                    'שינויים שלא נשמרו',
                    'יש שינויים שלא נשמרו. לצאת בלי לשמור?',
                    [
                      { text: 'ביטול', style: 'cancel' },
                      {
                        text: 'צא בלי לשמור',
                        style: 'destructive',
                        onPress: () => {
                          savedRef.current = true;
                          router.back();
                        },
                      },
                    ]
                  );
                }
              }}
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
            <ComboField
              value={category}
              onSelect={setCategory}
              options={DEFECT_CATEGORIES.map((c) => c.label)}
              placeholder="הקלד או בחר קטגוריה..."
              allowCustom
            />
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
              onChangeText={(text) => {
                setDescription(text);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                // Delay hiding to allow suggestion tap
                setTimeout(() => setShowSuggestions(false), 200);
              }}
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

            {/* Autocomplete suggestions from defect library */}
            {showSuggestions && suggestions.length > 0 && (
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
                {suggestions.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleSelectSuggestion(item)}
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

                    {/* Row 2: Category badge + location + cost badge */}
                    {item.category || item.location || item.cost !== null ? (
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

                        {item.cost !== null ? (
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
                              ₪{item.cost}
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
            {showAddToLibrary && !showSuggestions && (
              <Pressable
                onPress={handleAddToLibrary}
                disabled={isAdding || addedToLibrary}
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
                  borderColor: addedToLibrary
                    ? COLORS.primary[500]
                    : COLORS.primary[300],
                  backgroundColor: addedToLibrary
                    ? COLORS.primary[100]
                    : COLORS.primary[50],
                  marginTop: 8,
                  opacity: isAdding ? 0.6 : 1,
                }}
              >
                <Feather
                  name={addedToLibrary ? 'check-circle' : 'plus-circle'}
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
                  {addedToLibrary ? 'נוסף!' : 'הוסף למאגר'}
                </Text>
              </Pressable>
            )}
          </FormField>

          {/* 3. Location */}
          <FormField label="מיקום" filled={!!location} icon="map-pin">
            <ComboField
              value={location}
              onSelect={setLocation}
              options={locationLabels}
              placeholder="הקלד או בחר מיקום..."
              allowCustom
            />
          </FormField>

          {/* 4. Israeli Standard */}
          <FormField label="תקן ישראלי" filled={!!standardRef} icon="book-open">
            <ComboField
              value={standardRef}
              onSelect={handleSelectStandard}
              options={standardOptions}
              placeholder="חפש תקן ישראלי..."
              allowCustom
            />
            {standardDisplay ? (
              <View
                style={{
                  marginTop: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRightWidth: 2,
                  borderRightColor: COLORS.primary[500],
                  backgroundColor: COLORS.primary[50],
                  borderRadius: BORDER_RADIUS.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.neutral[600],
                    fontFamily: 'Rubik-Regular',
                    textAlign: 'right',
                    lineHeight: 18,
                  }}
                >
                  {standardDisplay}
                </Text>
              </View>
            ) : null}
          </FormField>

          {/* Separator */}
          <View
            style={{
              height: 1,
              backgroundColor: COLORS.cream[200],
              marginTop: 4,
              marginBottom: 12,
            }}
          />

          {/* 5. Recommendation */}
          <FormField label="המלצה לתיקון" filled={!!recommendation} icon="tool">
            <ComboField
              value={recommendation}
              onSelect={setRecommendation}
              options={RECOMMENDATION_SUGGESTIONS}
              placeholder="הקלד או בחר המלצה..."
              allowCustom
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
              onPickFromGallery={handlePickFromGallery}
              onDeletePhoto={handleDeletePhoto}
              onUpdateAnnotations={handleUpdateAnnotations}
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
