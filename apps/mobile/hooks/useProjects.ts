import { useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

// --- Types ---

export interface ProjectItem {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'completed' | 'archived';
  buildingsCount: number;
  totalApts: number;
  completedApts: number;
  openDefects: number;
  updatedAt: string;
}

// --- Query Key ---

export const projectsKeys = {
  all: ['projects'] as const,
  list: () => [...projectsKeys.all, 'list'] as const,
};

// --- Fetcher ---

async function fetchProjects(): Promise<ProjectItem[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(
      `id, name, address, city, status, updated_at,
       buildings(
         id,
         apartments(id, status)
       )`
    )
    .in('status', ['active', 'completed'])
    .order('name', { ascending: true });

  if (error) throw error;

  // Fetch open defect counts per project (scoped to user's org via RLS + explicit filter)
  const { data: userData } = await supabase.auth.getUser();
  const { data: profileData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', userData.user?.id ?? '')
    .single();

  const { data: defectsData } = await supabase
    .from('defects')
    .select(
      `id, delivery_reports(
        apartments(
          buildings(project_id)
        )
      )`
    )
    .eq('organization_id', profileData?.organization_id ?? '')
    .in('status', ['open', 'in_progress']);

  const defectsByProject = new Map<string, number>();
  for (const d of defectsData ?? []) {
    const report = d.delivery_reports as unknown as
      | {
          apartments?: { buildings?: { project_id?: string } };
        }
      | undefined;
    const projId = report?.apartments?.buildings?.project_id;
    if (projId) {
      defectsByProject.set(projId, (defectsByProject.get(projId) ?? 0) + 1);
    }
  }

  return (data ?? []).map((p: Record<string, unknown>) => {
    const buildings =
      (p.buildings as Array<{
        id: string;
        apartments: Array<{ id: string; status: string }>;
      }>) ?? [];

    const allApts = buildings.flatMap((b) => b.apartments ?? []);
    const completedApts = allApts.filter(
      (a) => a.status === 'completed' || a.status === 'delivered'
    ).length;

    const address = [p.address, p.city].filter(Boolean).join(', ');

    return {
      id: p.id as string,
      name: (p.name as string) ?? '',
      address,
      status: (p.status as ProjectItem['status']) ?? 'active',
      buildingsCount: buildings.length,
      totalApts: allApts.length,
      completedApts,
      openDefects: defectsByProject.get(p.id as string) ?? 0,
      updatedAt: (p.updated_at as string) ?? '',
    };
  });
}

// --- Hook ---

export function useProjects() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: projectsKeys.list(),
    queryFn: fetchProjects,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refetch = async () => {
    await queryClient.invalidateQueries({ queryKey: projectsKeys.list() });
  };

  return {
    projects: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.isError,
    refetch,
  };
}
