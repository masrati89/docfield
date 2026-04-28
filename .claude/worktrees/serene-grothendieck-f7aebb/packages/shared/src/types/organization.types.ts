import type { BaseEntity } from './common.types';
import type { ReportType } from './inspection.types';

export interface Organization extends BaseEntity {
  name: string;
  logoUrl?: string;
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  defaultReportType: ReportType;
  defaultLanguage: 'he' | 'en';
  pdfBrandingEnabled: boolean;
}
