import type { SupabaseClient } from '@supabase/supabase-js';

import type { Project, Building, Apartment } from '../types/project.types';

// --- Response types with computed counts ---

export interface ProjectWithCounts extends Project {
  apartmentCount: number;
  buildingCount: number;
}

export interface BuildingWithCounts extends Building {
  apartmentCount: number;
  deliveredCount: number;
}

export interface ApartmentWithReportCount extends Apartment {
  reportCount: number;
}

// --- Supabase row to camelCase mappers ---

function mapProject(row: Record<string, unknown>): ProjectWithCounts {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    name: row.name as string,
    address: (row.address as string) ?? undefined,
    city: (row.city as string) ?? undefined,
    status: row.status as Project['status'],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    buildingCount: Number(row.building_count ?? 0),
    apartmentCount: Number(row.apartment_count ?? 0),
  };
}

function mapBuilding(row: Record<string, unknown>): BuildingWithCounts {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    projectId: row.project_id as string,
    name: row.name as string,
    floorsCount: (row.floors_count as number) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    apartmentCount: Number(row.apartment_count ?? 0),
    deliveredCount: Number(row.delivered_count ?? 0),
  };
}

function mapApartment(row: Record<string, unknown>): ApartmentWithReportCount {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    buildingId: row.building_id as string,
    number: row.number as string,
    floor: (row.floor as number) ?? undefined,
    roomsCount: (row.rooms_count as number) ?? undefined,
    apartmentType:
      (row.apartment_type as Apartment['apartmentType']) ?? undefined,
    status: row.status as Apartment['status'],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    reportCount: Number(row.report_count ?? 0),
  };
}

// --- API Functions ---

export async function getProjects(
  supabase: SupabaseClient
): Promise<ProjectWithCounts[]> {
  // Use RPC or manual join — Supabase doesn't support nested counts directly
  // Fetch projects + count buildings and apartments per project
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const projectIds = data.map((project) => project.id as string);

  // Fetch buildings with IDs for counting
  const { data: buildingsData } = await supabase
    .from('buildings')
    .select('id, project_id')
    .in('project_id', projectIds);

  const buildingCountByProject = new Map<string, number>();
  const buildingIdToProject = new Map<string, string>();

  for (const building of buildingsData ?? []) {
    const pid = building.project_id as string;
    buildingCountByProject.set(pid, (buildingCountByProject.get(pid) ?? 0) + 1);
    buildingIdToProject.set(building.id as string, pid);
  }

  // Fetch apartment counts per project (via buildings)
  const buildingIds = (buildingsData ?? []).map((b) => b.id as string);
  const { data: apartments } =
    buildingIds.length > 0
      ? await supabase
          .from('apartments')
          .select('building_id')
          .in('building_id', buildingIds)
      : { data: [] };

  const apartmentCountByProject = new Map<string, number>();
  for (const apartment of apartments ?? []) {
    const pid = buildingIdToProject.get(apartment.building_id as string);
    if (pid) {
      apartmentCountByProject.set(
        pid,
        (apartmentCountByProject.get(pid) ?? 0) + 1
      );
    }
  }

  return data.map((row) =>
    mapProject({
      ...row,
      building_count: buildingCountByProject.get(row.id as string) ?? 0,
      apartment_count: apartmentCountByProject.get(row.id as string) ?? 0,
    })
  );
}

export async function getBuildingsByProject(
  supabase: SupabaseClient,
  projectId: string
): Promise<BuildingWithCounts[]> {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('project_id', projectId)
    .order('name', { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const buildingIds = data.map((building) => building.id as string);

  const { data: apartments } = await supabase
    .from('apartments')
    .select('building_id, status')
    .in('building_id', buildingIds);

  const countMap = new Map<string, { total: number; delivered: number }>();
  for (const apartment of apartments ?? []) {
    const buildingId = apartment.building_id as string;
    const current = countMap.get(buildingId) ?? { total: 0, delivered: 0 };
    current.total += 1;
    if (apartment.status === 'delivered' || apartment.status === 'completed') {
      current.delivered += 1;
    }
    countMap.set(buildingId, current);
  }

  return data.map((row) => {
    const counts = countMap.get(row.id as string) ?? {
      total: 0,
      delivered: 0,
    };
    return mapBuilding({
      ...row,
      apartment_count: counts.total,
      delivered_count: counts.delivered,
    });
  });
}

export async function getApartmentsByBuilding(
  supabase: SupabaseClient,
  buildingId: string
): Promise<ApartmentWithReportCount[]> {
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('building_id', buildingId)
    .order('floor', { ascending: true })
    .order('number', { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const apartmentIds = data.map((apartment) => apartment.id as string);

  const { data: reports } = await supabase
    .from('delivery_reports')
    .select('apartment_id')
    .in('apartment_id', apartmentIds);

  const reportCountMap = new Map<string, number>();
  for (const report of reports ?? []) {
    const apartmentId = report.apartment_id as string;
    reportCountMap.set(apartmentId, (reportCountMap.get(apartmentId) ?? 0) + 1);
  }

  return data.map((row) =>
    mapApartment({
      ...row,
      report_count: reportCountMap.get(row.id as string) ?? 0,
    })
  );
}

export async function getApartmentDetails(
  supabase: SupabaseClient,
  apartmentId: string
): Promise<ApartmentWithReportCount | null> {
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('id', apartmentId)
    .single();

  if (error) throw error;
  if (!data) return null;

  const { count } = await supabase
    .from('delivery_reports')
    .select('id', { count: 'exact', head: true })
    .eq('apartment_id', apartmentId);

  return mapApartment({ ...data, report_count: count ?? 0 });
}
