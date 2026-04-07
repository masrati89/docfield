import { useCallback } from 'react';
import { Alert } from 'react-native';

import { supabase } from '@/lib/supabase';
import type { ReportItem } from '@/hooks/useReports';

export function useDeleteReport(reports: ReportItem[], refetch: () => void) {
  const handleDeleteReport = useCallback(
    (reportId: string) => {
      const report = reports.find((r) => r.id === reportId);
      if (!report) return;

      // Only allow delete on draft/in_progress reports
      if (report.status === 'completed' || report.status === 'sent') {
        Alert.alert('לא ניתן למחוק', 'דוח שהושלם או נשלח אינו ניתן למחיקה.');
        return;
      }

      Alert.alert(
        'מחיקת דוח',
        'למחוק את הדוח? כל הממצאים והתמונות יימחקו לצמיתות.',
        [
          { text: 'ביטול', style: 'cancel' },
          {
            text: 'מחק',
            style: 'destructive',
            onPress: async () => {
              try {
                // Fetch all defects for this report
                const { data: defectsData } = await supabase
                  .from('defects')
                  .select('id')
                  .eq('delivery_report_id', reportId);

                const defectIds = (defectsData ?? []).map(
                  (d: { id: string }) => d.id
                );

                if (defectIds.length > 0) {
                  // Fetch all photos for these defects
                  const { data: photosData } = await supabase
                    .from('defect_photos')
                    .select('id, image_url')
                    .in('defect_id', defectIds);

                  // Delete storage files
                  if (photosData && photosData.length > 0) {
                    const storagePaths = photosData
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

                  // Delete defect_photos records
                  await supabase
                    .from('defect_photos')
                    .delete()
                    .in('defect_id', defectIds);

                  // Delete defects
                  await supabase
                    .from('defects')
                    .delete()
                    .eq('delivery_report_id', reportId);
                }

                // Delete the report
                const { error: deleteError } = await supabase
                  .from('delivery_reports')
                  .delete()
                  .eq('id', reportId);

                if (deleteError) throw deleteError;

                // Refresh list from server
                refetch();
              } catch (err) {
                console.error('[DeleteReport]', err);
                Alert.alert('שגיאה', 'לא הצלחנו למחוק את הדוח. נסה שוב.');
              }
            },
          },
        ]
      );
    },
    [reports, refetch]
  );

  return handleDeleteReport;
}
