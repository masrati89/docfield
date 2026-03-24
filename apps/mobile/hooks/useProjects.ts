import { useQuery } from '@tanstack/react-query';

import {
  getProjects,
  getBuildingsByProject,
  getApartmentsByBuilding,
  getApartmentDetails,
} from '@docfield/shared';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useProjects() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['projects', session?.user?.id],
    queryFn: () => getProjects(supabase),
    enabled: !!session,
  });
}

export function useBuildings(projectId: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['buildings', projectId, session?.user?.id],
    queryFn: () => getBuildingsByProject(supabase, projectId),
    enabled: !!session && !!projectId,
  });
}

export function useApartments(buildingId: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['apartments', buildingId, session?.user?.id],
    queryFn: () => getApartmentsByBuilding(supabase, buildingId),
    enabled: !!session && !!buildingId,
  });
}

export function useApartmentDetails(apartmentId: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['apartment', apartmentId, session?.user?.id],
    queryFn: () => getApartmentDetails(supabase, apartmentId),
    enabled: !!session && !!apartmentId,
  });
}
