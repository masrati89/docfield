import { useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { reportsKeys } from './useReports';

// --- Types ---

export interface ReportInfo {
  id: string;
  reportType: string;
  status: string;
  tenantName: string | null;
  reportDate: string;
  notes: string | null;
  projectName: string;
  buildingName: string;
  apartmentNumber: string;
  address: string | null;
  floor: number | null;
  checklistTemplateId: string | null;
  noChecklist: boolean;
}

export type DefectSource = 'checklist' | 'manual' | 'library' | 'inherited';
export type ReviewStatus =
  | 'pending_review'
  | 'fixed'
  | 'not_fixed'
  | 'partially_fixed';

export interface DefectItem {
  id: string;
  description: string;
  room: string | null;
  category: string | null;
  severity: string;
  status: string;
  standardRef: string | null;
  photoCount: number;
  source: DefectSource;
  reviewStatus: ReviewStatus | null;
  cost: number | null;
}

export interface ReportDetail {
  report: ReportInfo;
  defects: DefectItem[];
}

// --- Query Key ---

export const reportKeys = {
  detail: (id: string) => [...reportsKeys.all, 'detail', id] as const,
};

// --- Fetcher ---

async function fetchReport(id: string): Promise<ReportDetail> {
  // Fetch report with apartment → building → project (left join — apartment_id can be null)
  const { data: reportData, error: reportError } = await supabase
    .from('delivery_reports')
    .select(
      `id, report_type, status, tenant_name, report_date, notes, property_floor,
       checklist_template_id, no_checklist,
       apartments(number, buildings(name, projects(name, address)))`
    )
    .eq('id', id)
    .single();

  if (reportError) throw reportError;

  const apt = reportData.apartments as unknown as {
    number: string;
    buildings: {
      name: string;
      projects: { name: string; address: string | null };
    };
  } | null;

  const report: ReportInfo = {
    id: reportData.id,
    reportType: reportData.report_type,
    status: reportData.status,
    tenantName: reportData.tenant_name,
    reportDate: reportData.report_date,
    notes: reportData.notes,
    projectName: apt?.buildings?.projects?.name ?? '',
    buildingName: apt?.buildings?.name ?? '',
    apartmentNumber: apt?.number ?? '',
    address: apt?.buildings?.projects?.address ?? null,
    floor: (reportData.property_floor as number | null) ?? null,
    checklistTemplateId:
      (reportData.checklist_template_id as string | null) ?? null,
    noChecklist: (reportData.no_checklist as boolean) ?? false,
  };

  // Fetch defects with photo count
  const { data: defectsData, error: defectsError } = await supabase
    .from('defects')
    .select(
      'id, description, room, category, severity, status, standard_ref, source, review_status, cost, defect_photos(id, caption)'
    )
    .eq('delivery_report_id', id)
    .order('sort_order')
    .order('created_at');

  if (defectsError) throw defectsError;

  const defects: DefectItem[] = (defectsData ?? []).map(
    (d: Record<string, unknown>) => {
      const photos =
        (d.defect_photos as Array<{ id: string; caption: string | null }>) ??
        [];
      return {
        id: d.id as string,
        description: d.description as string,
        room: d.room as string | null,
        category: d.category as string | null,
        severity: d.severity as string,
        status: d.status as string,
        standardRef: d.standard_ref as string | null,
        photoCount: photos.length,
        source: ((d.source as DefectSource) ?? 'manual') as DefectSource,
        reviewStatus: (d.review_status as ReviewStatus | null) ?? null,
        cost: (d.cost as number | null) ?? null,
      };
    }
  );

  return { report, defects };
}

// --- Hook ---

export function useReport(id: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: reportKeys.detail(id ?? ''),
    queryFn: () => fetchReport(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refetch = async () => {
    if (id) {
      await queryClient.invalidateQueries({ queryKey: reportKeys.detail(id) });
    }
  };

  return {
    report: query.data?.report ?? null,
    defects: query.data?.defects ?? [],
    isLoading: query.isLoading,
    error: query.isError,
    refetch,
  };
}
