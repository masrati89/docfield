import type { TenantEntity } from './common.types';

export interface Client extends TenantEntity {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}
