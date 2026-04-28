import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import * as Haptics from '@/lib/haptics';
import { supabase } from '@/lib/supabase';
import { createDefectSchema } from '@infield/shared/src/validation';
import type { PhotoItem } from '@/components/defect/PhotoGrid';
import type { UseDefectFormReturn } from './useDefectForm';

// --- Types ---

export interface UseDefectSaveInput {
  reportId: string;
  organizationId: string;
  form: UseDefectFormReturn;
  photos: PhotoItem[];
  showToast: (msg: string, type: 'success' | 'error') => void;
  isDirty: boolean;
  templateId?: string;
}

export interface UseDefectSaveReturn {
  isSaving: boolean;
  confirmAction: {
    title: string;
    message: string;
    onConfirm: () => void;
  } | null;
  setConfirmAction: (
    val: { title: string; message: string; onConfirm: () => void } | null
  ) => void;
  closeModal: () => void;
  handleSave: () => Promise<void>;
}

// --- Hook ---

export function useDefectSave(input: UseDefectSaveInput): UseDefectSaveReturn {
  const {
    reportId,
    organizationId,
    form,
    photos,
    showToast,
    isDirty,
    templateId,
  } = input;

  const router = useRouter();
  const navigation = useNavigation();

  const [isSaving, setIsSaving] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const savedRef = useRef(false);
  const savingRef = useRef(false);

  // Close modal and dismiss/pop
  const closeModal = useCallback(() => {
    savedRef.current = true;
    if (router.canDismiss()) {
      router.dismiss();
    } else if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  // Navigation guard — warn on unsaved changes
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isDirty || savedRef.current || savingRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any).preventDefault();

      setConfirmAction({
        title: 'שינויים שלא נשמרו',
        message: 'יש שינויים שלא נשמרו. לצאת בלי לשמור?',
        onConfirm: () => closeModal(),
      });
    });

    return unsubscribe;
  }, [isDirty, navigation, closeModal]);

  // Save defect to Supabase
  const handleSave = useCallback(async () => {
    if (!form.canSave) {
      showToast('יש למלא תיאור וקטגוריה', 'error');
      return;
    }
    if (!reportId || !organizationId) {
      showToast('שגיאה בטעינת הדוח. נסה לצאת ולהיכנס מחדש', 'error');
      return;
    }
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    savingRef.current = true;
    setIsSaving(true);
    try {
      // Zod validation before Supabase insert (security M1)
      const validation = createDefectSchema.safeParse({
        deliveryReportId: reportId,
        description: form.description.trim(),
        room: form.location || '',
        category: form.category || '',
        severity: form.severity,
        source: 'manual' as const,
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
        setIsSaving(false);
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
          delivery_report_id: reportId,
          organization_id: organizationId,
          description: form.description,
          room: form.location || null,
          category: form.category || null,
          standard_ref: form.standardRef.trim() || null,
          standard_section: form.standardSection.trim() || null,
          severity: form.severity,
          source: 'manual',
          recommendation: form.recommendation.trim() || null,
          notes: form.note.trim() || null,
          cost: costValue,
          cost_unit: costValue !== null ? form.costUnit : null,
          unit_price: !isFixedCost ? parsedUnitPrice : null,
          quantity: !isFixedCost ? parsedQty : null,
          unit_label: !isFixedCost && costValue !== null ? form.costUnit : null,
          library_template_id: templateId || null,
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
      closeModal();
    } catch {
      showToast('שגיאה בשמירת הממצא', 'error');
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }, [
    form.canSave,
    form.category,
    form.description,
    form.location,
    form.severity,
    form.standardRef,
    form.standardSection,
    form.recommendation,
    form.note,
    form.costUnit,
    form.costAmount,
    form.costPerUnit,
    form.costQty,
    reportId,
    organizationId,
    photos,
    templateId,
    closeModal,
    showToast,
  ]);

  return {
    isSaving,
    confirmAction,
    setConfirmAction,
    closeModal,
    handleSave,
  };
}
