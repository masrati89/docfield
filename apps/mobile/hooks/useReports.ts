import { useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

// --- Types ---

export interface ReportItem {
  id: string;
  project: string;
  apartment: string;
  reportType: 'delivery' | 'bedek_bait';
  status: 'draft' | 'in_progress' | 'completed' | 'sent';
  defectCount: number;
  updatedAt: string;
}

// --- Query Key ---

export const reportsKeys = {
  all: ['reports'] as const,
  list: () => [...reportsKeys.all, 'list'] as const,
};

// --- Fetcher ---

async function fetchReports(): Promise<ReportItem[]> {
  const { data, error } = await supabase
    .from('delivery_reports')
    .select(
      `id, report_type, status, updated_at, report_date,
       apartments!inner(number, buildings!inner(name, projects!inner(name))),
       defects(id)`
    )
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((r: Record<string, unknown>) => {
    const apt = r.apartments as Record<string, unknown> | undefined;
    const bld = apt?.buildings as Record<string, unknown> | undefined;
    const prj = bld?.projects as Record<string, unknown> | undefined;
    const defects = r.defects as Array<unknown> | undefined;

    return {
      id: r.id as string,
      project: (prj?.name as string) ?? '',
      apartment: `דירה ${apt?.number ?? ''}, ${bld?.name ?? ''}`,
      reportType: (r.report_type as ReportItem['reportType']) ?? 'delivery',
      status: (r.status as ReportItem['status']) ?? 'draft',
      defectCount: defects?.length ?? 0,
      updatedAt: (r.updated_at as string) ?? (r.report_date as string) ?? '',
    };
  });
}

// --- Hook ---

export function useReports() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: reportsKeys.list(),
    queryFn: fetchReports,
  });

  const refetch = async () => {
    await queryClient.invalidateQueries({ queryKey: reportsKeys.list() });
  };

  return {
    reports: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.isError,
    refetch,
  };
}
