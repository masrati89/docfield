// --- Report Types ---

export type ReportType = 'delivery' | 'bedek_bait';
export type WizardStepId = 'report_type' | 'property' | 'client_details';

// --- Prefill (from Apartments / Projects context) ---

export interface WizardPrefill {
  reportType?: ReportType;
  projectId?: string;
  projectName?: string;
  buildingName?: string;
  apartmentId?: string;
  apartmentLabel?: string;
  apartmentFloor?: number | null;
  propertyAddress?: string;
}

// --- Project option (used by project ComboField in step 1) ---

export interface ProjectOption {
  id: string;
  name: string;
  address: string;
  reportTypeDefault?: ReportType | null;
  defaultTemplateId?: string | null;
}

// --- Wizard Props ---

export interface NewInspectionWizardProps {
  visible: boolean;
  onClose: () => void;
  prefill?: WizardPrefill;
}

// --- State ---

export interface WizardState {
  currentStepIndex: number;
  reportType: ReportType | null;
  // project (optional, selected in step 1)
  selectedProject: ProjectOption | null;
  projectFreetext: string;
  showProjectPicker: boolean;
  // property (step 2)
  propertyAddress: string;
  apartmentLabel: string;
  propertyFloor: string;
  propertyArea: string;
  propertyType: string;
  // apartment FK (from prefill only — not user-selectable in simplified wizard)
  apartmentId: string | null;
  // client details (step 3)
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  clientIdNumber: string;
  // template
  checklistTemplateId: string | null;
  noChecklist: boolean;
  // draft mode
  isDraft: boolean;
  // meta
  isSubmitting: boolean;
}

// --- Actions ---

export type WizardAction =
  | { type: 'SET_REPORT_TYPE'; payload: ReportType }
  | { type: 'SET_PROJECT'; payload: ProjectOption }
  | { type: 'SET_PROJECT_FREETEXT'; payload: string }
  | { type: 'CLEAR_PROJECT' }
  | { type: 'TOGGLE_PROJECT_PICKER'; payload: boolean }
  | { type: 'SET_PROPERTY_ADDRESS'; payload: string }
  | { type: 'SET_APARTMENT_LABEL'; payload: string }
  | { type: 'SET_PROPERTY_FLOOR'; payload: string }
  | { type: 'SET_PROPERTY_AREA'; payload: string }
  | { type: 'SET_PROPERTY_TYPE'; payload: string }
  | { type: 'SET_TENANT_NAME'; payload: string }
  | { type: 'SET_TENANT_PHONE'; payload: string }
  | { type: 'SET_TENANT_EMAIL'; payload: string }
  | { type: 'SET_CLIENT_ID_NUMBER'; payload: string }
  | { type: 'SET_CHECKLIST_TEMPLATE'; payload: string | null }
  | { type: 'TOGGLE_NO_CHECKLIST'; payload: boolean }
  | { type: 'TOGGLE_DRAFT'; payload: boolean }
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
