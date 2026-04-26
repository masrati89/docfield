import type { TenantEntity } from './common.types';

export type UserRole = 'admin' | 'project_manager' | 'inspector';

export type AuthProvider = 'email' | 'google' | 'apple';

export type UserProfession =
  | 'engineer'
  | 'constructor'
  | 'inspector'
  | 'project_manager'
  | 'architect'
  | 'building_technician'
  | 'site_manager';

export interface UserPreferences {
  defaultTemplateDelivery?: string;
  defaultTemplateBedekBait?: string;
  notificationsEnabled?: boolean;
}

export interface User extends TenantEntity {
  email: string;
  fullName: string;
  firstName?: string;
  organizationName?: string;
  profession?: UserProfession;
  role: UserRole;
  phone?: string;
  signatureUrl?: string;
  stampUrl?: string;
  avatarUrl?: string;
  provider: AuthProvider;
  isActive: boolean;
  preferences?: UserPreferences;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
