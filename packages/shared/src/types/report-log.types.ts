import type { TenantEntity } from './common.types';

export type ReportLogAction =
  | 'pdf_generated'
  | 'status_completed'
  | 'status_draft'
  | 'status_in_progress'
  | 'defect_added'
  | 'defect_updated'
  | 'defect_deleted'
  | 'photos_updated'
  | 'whatsapp_sent';

export interface ReportLog extends TenantEntity {
  deliveryReportId: string;
  userId: string;
  action: ReportLogAction;
  details?: Record<string, unknown>;
}
