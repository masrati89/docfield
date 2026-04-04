import type { TenantEntity } from './common.types';

export type NotificationType = 'app_update' | 'system_message' | 'reminder';

export interface Notification extends TenantEntity {
  userId: string;
  notificationType: NotificationType;
  title: string;
  body?: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  sentAt: string;
}
