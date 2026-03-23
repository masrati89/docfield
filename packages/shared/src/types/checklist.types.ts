import type { BaseEntity } from './common.types';
import type { ReportType } from './inspection.types';
import type { DefectSeverity } from './defect.types';

export interface ChecklistTemplate extends BaseEntity {
  organizationId?: string;
  name: string;
  reportType: ReportType;
  isGlobal: boolean;
  isActive: boolean;
}

export interface ChecklistCategory extends BaseEntity {
  templateId: string;
  name: string;
  sortOrder: number;
}

export interface ChecklistItem extends BaseEntity {
  categoryId: string;
  description: string;
  defaultSeverity: DefectSeverity;
  requiresPhoto: boolean;
  sortOrder: number;
}
