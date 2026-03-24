import { useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getChecklistWithResults,
  upsertChecklistResult,
} from '@docfield/shared';
import type {
  ChecklistSection,
  ChecklistItemWithResult,
} from '@docfield/shared';
import type { ChecklistResultValue } from '@docfield/shared';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export function useChecklistData(templateId: string, reportId: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['checklist', templateId, reportId],
    queryFn: () => getChecklistWithResults(supabase, templateId, reportId),
    enabled: !!templateId && !!reportId && !!session,
  });
}

export function useUpdateChecklistResult(templateId: string, reportId: string) {
  const queryClient = useQueryClient();
  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const mutation = useMutation({
    mutationFn: (data: {
      deliveryReportId: string;
      checklistItemId: string;
      result: ChecklistResultValue;
      note?: string;
    }) => upsertChecklistResult(supabase, data),
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: ['checklist', templateId, reportId],
      });

      // Snapshot previous value
      const previous = queryClient.getQueryData<ChecklistSection[]>([
        'checklist',
        templateId,
        reportId,
      ]);

      // Optimistic update
      queryClient.setQueryData<ChecklistSection[]>(
        ['checklist', templateId, reportId],
        (old) => {
          if (!old) return old;

          return old.map((section) => ({
            ...section,
            items: section.items.map(
              (item): ChecklistItemWithResult =>
                item.id === variables.checklistItemId
                  ? {
                      ...item,
                      result: variables.result,
                      note: variables.note ?? item.note,
                    }
                  : item
            ),
          }));
        }
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(
          ['checklist', templateId, reportId],
          context.previous
        );
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ['checklist', templateId, reportId],
      });
    },
  });

  // Debounced note update (500ms)
  const updateNote = useCallback(
    (checklistItemId: string, result: ChecklistResultValue, note: string) => {
      const existing = debounceTimers.current.get(checklistItemId);
      if (existing) clearTimeout(existing);

      // Optimistic UI update immediately
      queryClient.setQueryData<ChecklistSection[]>(
        ['checklist', templateId, reportId],
        (old) => {
          if (!old) return old;
          return old.map((section) => ({
            ...section,
            items: section.items.map(
              (item): ChecklistItemWithResult =>
                item.id === checklistItemId ? { ...item, note } : item
            ),
          }));
        }
      );

      const timer = setTimeout(() => {
        debounceTimers.current.delete(checklistItemId);
        mutation.mutate({
          deliveryReportId: reportId,
          checklistItemId,
          result,
          note,
        });
      }, 500);

      debounceTimers.current.set(checklistItemId, timer);
    },
    [mutation, queryClient, templateId, reportId]
  );

  return { mutation, updateNote };
}
