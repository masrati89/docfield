import type { TenantEntity } from './common.types';

export type ReportType =
  | 'delivery'
  | 'bedek_bait'
  | 'supervision'
  | 'leak_detection'
  | 'public_areas';

export type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

export type ChecklistResultValue = 'pass' | 'fail' | 'partial' | 'skip' | 'na';

export interface DeliveryReport extends TenantEntity {
  apartmentId: string;
  inspectorId: string;
  checklistTemplateId?: string;
  reportType: ReportType;
  roundNumber: number;
  previousRoundId?: string;
  status: ReportStatus;
  tenantName?: string;
  tenantPhone?: string;
  tenantEmail?: string;
  notes?: string;
  pdfUrl?: string;
  projectNameFreetext?: string;
  apartmentLabelFreetext?: string;
  reportDate: string;
  completedAt?: string;
}

export interface ChecklistResult extends TenantEntity {
  deliveryReportId: string;
  checklistItemId: string;
  result: ChecklistResultValue;
  note?: string;
}
