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
  // PDF infrastructure (migration 026)
  reportNumber?: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientIdNumber?: string;
  propertyType?: string;
  propertyArea?: number;
  propertyFloor?: number;
  propertyDescription?: string;
  reportContent?: Record<string, unknown>;
  weatherConditions?: string;
  contractorName?: string;
  contractorPhone?: string;
  // Inspector snapshots (migrations 029 + 032)
  inspectorFullNameSnapshot?: string;
  inspectorLicenseNumberSnapshot?: string;
  inspectorProfessionalTitleSnapshot?: string;
  inspectorEducationSnapshot?: string;
  inspectorExperienceSnapshot?: string;
  inspectorCompanyNameSnapshot?: string;
  inspectorSignatureUrlSnapshot?: string;
  inspectorStampUrlSnapshot?: string;
  inspectorPhoneSnapshot?: string;
  inspectorEmailSnapshot?: string;
  // Organization snapshots (migration 029)
  organizationNameSnapshot?: string;
  organizationLogoUrlSnapshot?: string;
  organizationLegalNameSnapshot?: string;
  organizationTaxIdSnapshot?: string;
  organizationAddressSnapshot?: string;
  organizationPhoneSnapshot?: string;
  organizationEmailSnapshot?: string;
  organizationLegalDisclaimerSnapshot?: string;
  // Property snapshots (migration 033)
  propertyProjectName?: string;
  propertyProjectAddress?: string;
  propertyBuildingName?: string;
  propertyApartmentNumber?: string;
  // BOQ rate snapshots (migration 037)
  orgBoqBatzamRateSnapshot?: number;
  orgBoqSupervisionRateSnapshot?: number;
  orgBoqVatRateSnapshot?: number;
}

export interface ChecklistResult extends TenantEntity {
  deliveryReportId: string;
  checklistItemId: string;
  result: ChecklistResultValue;
  note?: string;
}
