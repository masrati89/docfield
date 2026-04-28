import type { BaseEntity, TenantEntity } from './common.types';

export type DefectSeverity = 'critical' | 'medium' | 'low';

export type DefectStatus = 'open' | 'in_progress' | 'fixed' | 'not_fixed';

export type DefectSource = 'checklist' | 'manual' | 'library';

export interface Defect extends TenantEntity {
  deliveryReportId: string;
  checklistResultId?: string;
  description: string;
  room: string;
  category: string;
  severity: DefectSeverity;
  status: DefectStatus;
  source: DefectSource;
  sortOrder: number;
}

export interface DefectPhoto extends BaseEntity {
  defectId: string;
  organizationId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  annotations: DefectAnnotation[];
  sortOrder: number;
}

export interface DefectAnnotation {
  type: 'arrow' | 'circle' | 'text';
  x: number;
  y: number;
  endX?: number;
  endY?: number;
  text?: string;
}

export interface DefectLibraryItem extends BaseEntity {
  organizationId?: string;
  description: string;
  category: string;
  defaultSeverity: DefectSeverity;
  standardReference?: string;
  isGlobal: boolean;
}
