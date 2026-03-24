import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getChecklistTemplates, createDeliveryReport } from '@docfield/shared';
import type { CreateDeliveryReportInput } from '@docfield/shared';

import { supabase } from '@/lib/supabase';

export function useChecklistTemplates(organizationId: string) {
  return useQuery({
    queryKey: ['checklist-templates', organizationId],
    queryFn: () => getChecklistTemplates(supabase, organizationId),
    enabled: !!organizationId,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeliveryReportInput) =>
      createDeliveryReport(supabase, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartments'] });
      queryClient.invalidateQueries({ queryKey: ['apartment'] });
    },
  });
}
