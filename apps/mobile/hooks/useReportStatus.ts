import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { supabase } from '@/lib/supabase';

// --- Types ---

type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

interface UseReportStatusResult {
  isUpdating: boolean;
  markCompleted: (reportId: string, apartmentId?: string) => void;
  reopenForEditing: (reportId: string) => void;
  transitionToDraft: (reportId: string) => Promise<void>;
}

// --- Hook ---

export function useReportStatus(
  onSuccess?: (message: string) => void,
  onError?: (message: string) => void,
  onStatusChanged?: () => void
): UseReportStatusResult {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = useCallback(
    async (
      reportId: string,
      newStatus: ReportStatus,
      extras?: { apartmentId?: string; completedAt?: string }
    ) => {
      setIsUpdating(true);
      try {
        const updateData: Record<string, unknown> = { status: newStatus };
        if (extras?.completedAt) {
          updateData.completed_at = extras.completedAt;
        }

        const { error } = await supabase
          .from('delivery_reports')
          .update(updateData)
          .eq('id', reportId);

        if (error) throw error;

        // Update apartment status if completing
        if (newStatus === 'completed' && extras?.apartmentId) {
          await supabase
            .from('apartments')
            .update({ status: 'completed' })
            .eq('id', extras.apartmentId);
        }

        onStatusChanged?.();
      } catch {
        throw new Error('שגיאה בעדכון סטטוס הדוח');
      } finally {
        setIsUpdating(false);
      }
    },
    [onStatusChanged]
  );

  // in_progress → completed (single confirmation)
  const markCompleted = useCallback(
    (reportId: string, apartmentId?: string) => {
      Alert.alert(
        'סימון כהושלם',
        'לסמן את הדוח כהושלם? לא ניתן יהיה לערוך ללא אישור נוסף.',
        [
          { text: 'ביטול', style: 'cancel' },
          {
            text: 'סמן כהושלם',
            onPress: async () => {
              try {
                await updateStatus(reportId, 'completed', {
                  apartmentId,
                  completedAt: new Date().toISOString(),
                });
                onSuccess?.('הדוח סומן כהושלם');
              } catch {
                onError?.('שגיאה בסימון הדוח כהושלם');
              }
            },
          },
        ]
      );
    },
    [updateStatus, onSuccess, onError]
  );

  // completed → in_progress (DOUBLE confirmation — Iron Rule)
  const reopenForEditing = useCallback(
    (reportId: string) => {
      // Step 1
      Alert.alert('חזרה לעריכה', 'הדוח הושלם. לחזור למצב עריכה?', [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'אישור',
          onPress: () => {
            // Step 2 — second confirmation
            Alert.alert(
              'אישור נוסף',
              'שים לב: חזרה לעריכה תאפשר שינויים בדוח המשפטי. להמשיך?',
              [
                { text: 'ביטול', style: 'cancel' },
                {
                  text: 'כן, המשך',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await updateStatus(reportId, 'in_progress');
                      onSuccess?.('הדוח חזר למצב עריכה');
                    } catch {
                      onError?.('שגיאה בפתיחת הדוח לעריכה');
                    }
                  },
                },
              ]
            );
          },
        },
      ]);
    },
    [updateStatus, onSuccess, onError]
  );

  // draft → in_progress (free transition for testing)
  const transitionToDraft = useCallback(
    async (reportId: string) => {
      try {
        await updateStatus(reportId, 'in_progress');
        onSuccess?.('הדוח עבר למצב בביצוע');
      } catch {
        onError?.('שגיאה בעדכון סטטוס');
      }
    },
    [updateStatus, onSuccess, onError]
  );

  return { isUpdating, markCompleted, reopenForEditing, transitionToDraft };
}
