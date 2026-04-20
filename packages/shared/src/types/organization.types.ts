import type { BaseEntity } from './common.types';
import type { ReportType } from './inspection.types';

export interface Organization extends BaseEntity {
  name: string;
  logoUrl?: string;
  settings: OrganizationSettings;
}

export interface BoqRates {
  batzam: number;
  supervision: number;
  vat: number;
}

export interface OrganizationSettings {
  defaultReportType: ReportType;
  defaultLanguage: 'he' | 'en';
  pdfBrandingEnabled: boolean;
  boqRates?: BoqRates;
}
