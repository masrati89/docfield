import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

// --- Types (previously in wizard types, now local) ---

export interface ApartmentOption {
  id: string;
  number: string;
  floor: number | null;
  status: string;
  buildingId: string;
  buildingName: string;
}

export interface BuildingGroup {
  id: string;
  name: string;
  apartments: ApartmentOption[];
}

// --- Query Key ---

export const projectApartmentsKeys = {
  all: ['project-apartments'] as const,
  byProject: (id: string) => [...projectApartmentsKeys.all, id] as const,
};

// --- Fetcher ---

async function fetchBuildingsWithApartments(
  projectId: string
): Promise<BuildingGroup[]> {
  const { data, error } = await supabase
    .from('buildings')
    .select(
      `id, name,
       apartments(id, number, floor, status)`
    )
    .eq('project_id', projectId)
    .order('name', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((b: Record<string, unknown>) => {
    const apts =
      (b.apartments as Array<{
        id: string;
        number: string;
        floor: number | null;
        status: string;
      }>) ?? [];

    return {
      id: b.id as string,
      name: (b.name as string) ?? '',
      apartments: apts
        .sort((a, c) => (a.floor ?? 0) - (c.floor ?? 0))
        .map((a) => ({
          id: a.id,
          number: a.number,
          floor: a.floor,
          status: a.status,
          buildingId: b.id as string,
          buildingName: (b.name as string) ?? '',
        })),
    };
  });
}

// --- Hook ---

export function useProjectApartments(projectId: string | null) {
  const query = useQuery({
    queryKey: projectApartmentsKeys.byProject(projectId ?? ''),
    queryFn: () => fetchBuildingsWithApartments(projectId!),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Flatten for simple single-building case
  const allApartments = useMemo<ApartmentOption[]>(() => {
    if (!query.data) return [];
    return query.data.flatMap((b) => b.apartments);
  }, [query.data]);

  return {
    buildings: query.data ?? [],
    allApartments,
    isLoading: query.isLoading,
    isSingleBuilding: (query.data ?? []).length === 1,
  };
}
