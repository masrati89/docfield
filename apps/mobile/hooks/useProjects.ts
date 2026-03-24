import { useQuery } from '@tanstack/react-query';

import {
  getProjects,
  getBuildingsByProject,
  getApartmentsByBuilding,
  getApartmentDetails,
} from '@docfield/shared';

import { supabase } from '@/lib/supabase';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(supabase),
  });
}

export function useBuildings(projectId: string) {
  return useQuery({
    queryKey: ['buildings', projectId],
    queryFn: () => getBuildingsByProject(supabase, projectId),
    enabled: !!projectId,
  });
}

export function useApartments(buildingId: string) {
  return useQuery({
    queryKey: ['apartments', buildingId],
    queryFn: () => getApartmentsByBuilding(supabase, buildingId),
    enabled: !!buildingId,
  });
}

export function useApartmentDetails(apartmentId: string) {
  return useQuery({
    queryKey: ['apartment', apartmentId],
    queryFn: () => getApartmentDetails(supabase, apartmentId),
    enabled: !!apartmentId,
  });
}
