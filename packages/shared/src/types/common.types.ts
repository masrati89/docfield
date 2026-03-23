// Base interfaces inherited by all entities

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Every tenant-scoped entity includes organizationId for RLS isolation
export interface TenantEntity extends BaseEntity {
  organizationId: string;
}
