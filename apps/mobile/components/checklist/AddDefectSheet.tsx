import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { DEFECT_CATEGORIES } from '@infield/shared';
import { BottomSheetWrapper } from '@/components/ui';
import { Button } from '@/components/ui';
import { ComboField } from '@/components/defect/ComboField';

import { CHECKLIST_ROOMS } from './constants';
import type { ChecklistRoom } from './types';

// --- Types ---

interface AddDefectSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    category: string;
    location: string;
    description: string;
  }) => void | Promise<void>;
  rooms?: ChecklistRoom[];
  /** Report type — controls which fields are shown */
  reportType?: 'bedek_bait' | 'delivery' | string;
}

// --- Component ---

export function AddDefectSheet({
  visible,
  onClose,
  onSave,
  rooms,
  reportType = 'bedek_bait',
}: AddDefectSheetProps) {
  const _isDelivery = reportType === 'delivery';
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const categoryLabels = DEFECT_CATEGORIES.map((c) => c.label);
  const locationLabels = (rooms ?? CHECKLIST_ROOMS).map((r) => r.name);

  const canSave = !!category && !!description.trim();

  useEffect(() => {
    if (visible) {
      setCategory('');
      setLocation('');
      setDescription('');
      setIsSaving(false);
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    // On web, ref is a View (no .close method) — double optional chaining
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (bottomSheetRef.current as any)?.close?.();
    onClose();
  }, [onClose]);

  const handleSave = useCallback(async () => {
    if (!canSave || isSaving) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsSaving(true);
    try {
      await onSave({ category, location, description });
      handleClose();
    } finally {
      setIsSaving(false);
    }
  }, [canSave, isSaving, category, location, description, onSave, handleClose]);

  if (!visible) return null;

  return (
    <BottomSheetWrapper
      ref={bottomSheetRef}
      snapPoints={['90%']}
      onClose={onClose}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingBottom: 12,
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
          הוספת ליקוי
        </Text>
        <Pressable
          onPress={handleClose}
          style={{
            backgroundColor: COLORS.cream[100],
            borderRadius: 8,
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="x" size={20} color={COLORS.neutral[600]} />
        </Pressable>
      </View>

      {/* Form */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category */}
        <View style={{ marginBottom: 14 }}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Feather name="grid" size={16} color={COLORS.neutral[400]} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: COLORS.neutral[700],
                  fontFamily: 'Rubik-Medium',
                }}
              >
                קטגוריה <Text style={{ color: COLORS.danger[500] }}>*</Text>
              </Text>
            </View>
            {category ? (
              <Feather name="check" size={16} color={COLORS.primary[500]} />
            ) : null}
          </View>
          <ComboField
            value={category}
            onSelect={setCategory}
            options={categoryLabels}
            placeholder="הקלד או בחר קטגוריה..."
            allowCustom
          />
        </View>

        {/* Location */}
        <View style={{ marginBottom: 14 }}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 4,
              marginBottom: 6,
            }}
          >
            <Feather name="map-pin" size={16} color={COLORS.neutral[400]} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: COLORS.neutral[500],
                fontFamily: 'Rubik-Medium',
              }}
            >
              מיקום (חדר)
            </Text>
          </View>
          <ComboField
            value={location}
            onSelect={setLocation}
            options={locationLabels}
            placeholder="הקלד או בחר מיקום..."
            allowCustom
          />
        </View>

        {/* Description */}
        <View style={{ marginBottom: 14 }}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 4,
              marginBottom: 6,
            }}
          >
            <Feather
              name="alert-triangle"
              size={16}
              color={COLORS.neutral[400]}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: COLORS.neutral[700],
                fontFamily: 'Rubik-Medium',
              }}
            >
              תיאור הליקוי <Text style={{ color: COLORS.danger[500] }}>*</Text>
            </Text>
          </View>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="תאר את הליקוי שמצאת..."
            placeholderTextColor={COLORS.neutral[400]}
            multiline
            numberOfLines={3}
            maxLength={500}
            style={{
              paddingVertical: 10,
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
              minHeight: 80,
            }}
          />
        </View>

        {/* Camera button */}
        <Pressable
          style={{
            width: '100%',
            paddingVertical: 10,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: COLORS.primary[200],
            backgroundColor: COLORS.primary[50],
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Feather name="camera" size={20} color={COLORS.primary[500]} />
          <Text
            style={{
              fontSize: 13,
              color: COLORS.primary[500],
              fontFamily: 'Rubik-Medium',
            }}
          >
            צלם תמונה
          </Text>
        </Pressable>
      </ScrollView>

      {/* Save button */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 20,
          borderTopWidth: 1,
          borderTopColor: COLORS.cream[200],
        }}
      >
        <Button
          label={isSaving ? 'שומר...' : 'הוסף ליקוי'}
          onPress={handleSave}
          disabled={!canSave || isSaving}
          loading={isSaving}
          size="lg"
        />
      </View>
    </BottomSheetWrapper>
  );
}
