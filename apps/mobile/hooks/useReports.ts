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
  roundNumber: number;
  inheritedFixedCount: number;
  inheritedTotalCount: number;
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
      `id, report_type, status, updated_at, report_date, round_number,
       apartments(number, buildings(name, projects(name))),
       defects(id, source, review_status)`
    )
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((r: Record<string, unknown>) => {
    const apt = r.apartments as Record<string, unknown> | undefined;
    const bld = apt?.buildings as Record<string, unknown> | undefined;
    const prj = bld?.projects as Record<string, unknown> | undefined;
    const defects =
      (r.defects as Array<{
        id: string;
        source: string | null;
        review_status: string | null;
      }>) ?? [];

    const inherited = defects.filter((d) => d.source === 'inherited');

    return {
      id: r.id as string,
      project: (prj?.name as string) ?? '',
      apartment: `דירה ${apt?.number ?? ''}, ${bld?.name ?? ''}`,
      reportType: (r.report_type as ReportItem['reportType']) ?? 'delivery',
      status: (r.status as ReportItem['status']) ?? 'draft',
      defectCount: defects.length,
      updatedAt: (r.updated_at as string) ?? (r.report_date as string) ?? '',
      roundNumber: (r.round_number as number) ?? 1,
      inheritedFixedCount: inherited.filter((d) => d.review_status === 'fixed')
        .length,
      inheritedTotalCount: inherited.length,
    };
  });
}

// --- Hook ---

export function useReports() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: reportsKeys.list(),
    queryFn: fetchReports,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
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
