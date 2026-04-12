import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { reportKeys, type ReviewStatus } from '@/hooks/useReport';

// --- Hook ---

/**
 * Updates the review_status of an inherited defect (round 2+).
 * Invalidates the report detail query on success so DefectRow rerenders.
 */
export function useDefectReviewStatus(reportId: string | undefined) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: {
      defectId: string;
      reviewStatus: ReviewStatus;
      reviewNote?: string | null;
    }) => {
      const { error } = await supabase
        .from('defects')
        .update({
          review_status: params.reviewStatus,
          review_note: params.reviewNote ?? null,
        })
        .eq('id', params.defectId);

      if (error) throw error;
    },
    onSuccess: () => {
      if (reportId) {
        queryClient.invalidateQueries({
          queryKey: reportKeys.detail(reportId),
        });
      }
    },
  });

  const updateReviewStatus = useCallback(
    (defectId: string, reviewStatus: ReviewStatus, reviewNote?: string) => {
      mutation.mutate({ defectId, reviewStatus, reviewNote });
    },
    [mutation]
  );

  return {
    updateReviewStatus,
    isUpdating: mutation.isPending,
  };
}
