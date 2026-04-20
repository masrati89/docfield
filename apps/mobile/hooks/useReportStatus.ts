import { useCallback, useState } from 'react';

import { supabase } from '@/lib/supabase';

// --- Types ---

type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

interface FinalizeParams {
  reportId: string;
  userId: string;
  organizationId: string;
}

interface PendingAction {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}

interface UseReportStatusResult {
  isUpdating: boolean;
  markCompleted: (reportId: string, apartmentId?: string) => void;
  reopenForEditing: (reportId: string) => void;
  finalizeFromDraft: (params: FinalizeParams) => void;
  pendingAction: PendingAction | null;
  dismissAction: () => void;
}

// --- Hook ---

export function useReportStatus(
  onSuccess?: (message: string) => void,
  onError?: (message: string) => void,
  onStatusChanged?: () => void
): UseReportStatusResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );

  const dismissAction = useCallback(() => setPendingAction(null), []);

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
      setPendingAction({
        title: 'סימון כהושלם',
        message: 'לסמן את הדוח כהושלם? לא ניתן יהיה לערוך ללא אישור נוסף.',
        confirmLabel: 'סמן כהושלם',
        onConfirm: async () => {
          setPendingAction(null);
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
      });
    },
    [updateStatus, onSuccess, onError]
  );

  // completed → in_progress (DOUBLE confirmation — Iron Rule)
  const reopenForEditing = useCallback(
    (reportId: string) => {
      // Step 1
      setPendingAction({
        title: 'חזרה לעריכה',
        message: 'הדוח הושלם. לחזור למצב עריכה?',
        confirmLabel: 'אישור',
        onConfirm: () => {
          // Step 2 — second confirmation
          setPendingAction({
            title: 'אישור נוסף',
            message: 'שים לב: חזרה לעריכה תאפשר שינויים בדוח המשפטי. להמשיך?',
            confirmLabel: 'כן, המשך',
            destructive: true,
            onConfirm: async () => {
              setPendingAction(null);
              try {
                await updateStatus(reportId, 'in_progress');
                onSuccess?.('הדוח חזר למצב עריכה');
              } catch {
                onError?.('שגיאה בפתיחת הדוח לעריכה');
              }
            },
          });
        },
      });
    },
    [updateStatus, onSuccess, onError]
  );

  // draft → in_progress (with confirmation — billing moment, one-way)
  const finalizeFromDraft = useCallback(
    (params: FinalizeParams) => {
      setPendingAction({
        title: 'הפיכת טיוטה לדוח רגיל',
        message: 'הדוח ייספר כדוח בתשלום. פעולה זו אינה הפיכה.',
        confirmLabel: 'אישור',
        destructive: true,
        onConfirm: async () => {
          setPendingAction(null);
          try {
            await updateStatus(params.reportId, 'in_progress');

            // Write billing event to report_log (append-only)
            await supabase.from('report_log').insert({
              delivery_report_id: params.reportId,
              organization_id: params.organizationId,
              user_id: params.userId,
              action: 'report_finalized',
              details: { finalized_at: new Date().toISOString() },
            });

            onSuccess?.('הדוח הופעל — החיוב נרשם');
          } catch {
            onError?.('שגיאה בהפעלת הדוח');
          }
        },
      });
    },
    [updateStatus, onSuccess, onError]
  );

  return {
    isUpdating,
    markCompleted,
    reopenForEditing,
    finalizeFromDraft,
    pendingAction,
    dismissAction,
  };
}
