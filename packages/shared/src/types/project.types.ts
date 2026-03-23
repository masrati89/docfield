import type { TenantEntity } from './common.types';

export type ProjectStatus = 'active' | 'completed' | 'archived';

export type ApartmentStatus = 'pending' | 'in_progress' | 'delivered' | 'completed';

export type ApartmentType = 'regular' | 'garden' | 'penthouse' | 'duplex' | 'studio';

export interface Project extends TenantEntity {
  name: string;
  address?: string;
  city?: string;
  status: ProjectStatus;
}

export interface Building extends TenantEntity {
  projectId: string;
  name: string;
  floorsCount?: number;
}

export interface Apartment extends TenantEntity {
  buildingId: string;
  number: string;
  floor?: number;
  roomsCount?: number;
  apartmentType?: ApartmentType;
  status: ApartmentStatus;
}
