import { useCallback, useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { ProjectItem } from '@/hooks/useProjects';

// --- Types ---

interface PendingAction {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}

interface UseDeleteProjectReturn {
  handleDeleteProject: (projectId: string) => void;
  pendingAction: PendingAction | null;
  dismissAction: () => void;
  errorMessage: string | null;
  clearError: () => void;
}

// --- Hook ---

export function useDeleteProject(
  projects: ProjectItem[],
  refetch: () => void
): UseDeleteProjectReturn {
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dismissAction = useCallback(() => setPendingAction(null), []);
  const clearError = useCallback(() => setErrorMessage(null), []);

  const handleDeleteProject = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      // First confirmation
      setPendingAction({
        title: 'מחיקת פרויקט',
        message: `למחוק את הפרויקט "${project.name}"?\nכל הבניינים, הדירות והדוחות שמשויכים לפרויקט זה יימחקו לצמיתות.`,
        confirmLabel: 'מחק',
        destructive: true,
        onConfirm: () => {
          // Second confirmation
          setPendingAction({
            title: 'אישור סופי',
            message: 'פעולה זו בלתי הפיכה. האם אתה בטוח?',
            confirmLabel: 'מחק לצמיתות',
            destructive: true,
            onConfirm: async () => {
              setPendingAction(null);
              await deleteProject(projectId, refetch, setErrorMessage);
            },
          });
        },
      });
    },
    [projects, refetch]
  );

  return {
    handleDeleteProject,
    pendingAction,
    dismissAction,
    errorMessage,
    clearError,
  };
}

async function deleteProject(
  projectId: string,
  refetch: () => void,
  setErrorMessage: (msg: string | null) => void
) {
  try {
    // 1. Get all buildings for this project
    const { data: buildings } = await supabase
      .from('buildings')
      .select('id')
      .eq('project_id', projectId);

    const buildingIds = (buildings ?? []).map((b: { id: string }) => b.id);

    if (buildingIds.length > 0) {
      // 2. Get all apartments for these buildings
      const { data: apartments } = await supabase
        .from('apartments')
        .select('id')
        .in('building_id', buildingIds);

      const apartmentIds = (apartments ?? []).map((a: { id: string }) => a.id);

      if (apartmentIds.length > 0) {
        // 3. Get all delivery reports for these apartments
        const { data: reports } = await supabase
          .from('delivery_reports')
          .select('id')
          .in('apartment_id', apartmentIds);

        const reportIds = (reports ?? []).map((r: { id: string }) => r.id);

        if (reportIds.length > 0) {
          // 4. Get all defects for these reports
          const { data: defects } = await supabase
            .from('defects')
            .select('id')
            .in('delivery_report_id', reportIds);

          const defectIds = (defects ?? []).map((d: { id: string }) => d.id);

          if (defectIds.length > 0) {
            // 5. Delete defect photos (storage + records)
            const { data: photos } = await supabase
              .from('defect_photos')
              .select('id, image_url')
              .in('defect_id', defectIds);

            if (photos && photos.length > 0) {
              const storagePaths = photos
                .map((p) => {
                  const url = p.image_url as string;
                  const match = url.match(/defect-photos\/(.+)$/);
                  return match ? match[1] : null;
                })
                .filter((p): p is string => !!p);

              if (storagePaths.length > 0) {
                await supabase.storage
                  .from('defect-photos')
                  .remove(storagePaths);
              }
            }

            await supabase
              .from('defect_photos')
              .delete()
              .in('defect_id', defectIds);

            // 6. Delete defects
            await supabase
              .from('defects')
              .delete()
              .in('delivery_report_id', reportIds);
          }

          // 7. Delete signatures for these reports
          await supabase
            .from('signatures')
            .delete()
            .in('delivery_report_id', reportIds);

          // 8. Delete checklist results
          await supabase
            .from('checklist_results')
            .delete()
            .in('delivery_report_id', reportIds);

          // 9. Delete delivery reports
          await supabase
            .from('delivery_reports')
            .delete()
            .in('apartment_id', apartmentIds);
        }

        // 10. Delete apartments
        await supabase
          .from('apartments')
          .delete()
          .in('building_id', buildingIds);
      }

      // 11. Delete buildings
      await supabase.from('buildings').delete().eq('project_id', projectId);
    }

    // 12. Delete the project itself
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;

    refetch();
  } catch {
    setErrorMessage('לא הצלחנו למחוק את הפרויקט. נסה שוב.');
  }
}
