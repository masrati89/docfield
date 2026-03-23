import type { TenantEntity } from './common.types';

export type UserRole = 'admin' | 'project_manager' | 'inspector';

export interface User extends TenantEntity {
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
