import type { ChecklistTemplateValue } from '@infield/shared';

// --- Report & Protocol Types ---

export type ReportType = 'delivery' | 'bedek_bait';
export type ProtocolMode = 'smart_checklist' | 'empty_protocol';
export type WizardStepId =
  | 'report_type'
  | 'project'
  | 'buildings'
  | 'apartment_counts'
  | 'apartment'
  | 'client_details'
  | 'protocol';

// --- Prefill (from Apartments context) ---

export interface WizardPrefill {
  reportType?: ReportType;
  projectId?: string;
  projectName?: string;
  buildingName?: string;
  apartmentId?: string;
  apartmentLabel?: string;
}

// --- Wizard Props ---

export interface NewInspectionWizardProps {
  visible: boolean;
  onClose: () => void;
  prefill?: WizardPrefill;
}

// --- Project / Apartment options ---

export interface ProjectOption {
  id: string;
  name: string;
  address: string;
  reportTypeDefault?: ReportType | null;
  defaultTemplateId?: string | null;
}

export interface BuildingGroup {
  id: string;
  name: string;
  apartments: ApartmentOption[];
}

export interface ApartmentOption {
  id: string;
  number: string;
  floor: number | null;
  status: string;
  buildingId: string;
  buildingName: string;
}

// --- State ---

export interface NewBuildingEntry {
  name: string;
}

export interface WizardState {
  currentStepIndex: number;
  reportType: ReportType | null;
  // project
  selectedProject: ProjectOption | null;
  projectFreetext: string;
  projectSkipped: boolean;
  // new project creation
  newBuildings: NewBuildingEntry[];
  newApartmentCounts: Record<number, number>; // buildingIndex → count
  // apartment
  selectedApartment: ApartmentOption | null;
  apartmentFreetext: string;
  // client details (bedek bait)
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  // protocol
  protocolMode: ProtocolMode | null;
  selectedTemplate: ChecklistTemplateValue | null;
  // meta
  isSubmitting: boolean;
}

// --- Actions ---

export type WizardAction =
  | { type: 'SET_REPORT_TYPE'; payload: ReportType }
  | { type: 'SET_PROJECT'; payload: ProjectOption }
  | { type: 'SET_PROJECT_FREETEXT'; payload: string }
  | { type: 'CLEAR_PROJECT' }
  | { type: 'SKIP_PROJECT' }
  | { type: 'SET_BUILDINGS_COUNT'; payload: number }
  | { type: 'SET_BUILDING_NAME'; payload: { index: number; name: string } }
  | {
      type: 'SET_APARTMENT_COUNT';
      payload: { buildingIndex: number; count: number };
    }
  | { type: 'SET_APARTMENT'; payload: ApartmentOption }
  | { type: 'SET_APARTMENT_FREETEXT'; payload: string }
  | { type: 'SET_TENANT_NAME'; payload: string }
  | { type: 'SET_TENANT_PHONE'; payload: string }
  | { type: 'SET_TENANT_EMAIL'; payload: string }
  | { type: 'SET_PROTOCOL_MODE'; payload: ProtocolMode }
  | { type: 'SET_TEMPLATE'; payload: ChecklistTemplateValue }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET' };

// --- Step Component Props ---

export interface StepProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  readOnly?: boolean;
}
