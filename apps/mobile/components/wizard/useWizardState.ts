import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { InteractionManager } from 'react-native';
import { useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { createReportWithSnapshot } from '@/lib/createReportWithSnapshot';
import { copyInheritedDefects } from '@/lib/copyInheritedDefects';
import { useAuth } from '@/contexts/AuthContext';

import type {
  WizardState,
  WizardAction,
  WizardStepId,
  WizardPrefill,
  ReportType,
} from './NewInspectionWizard.types';

// --- Initial State ---

function createInitialState(prefill?: WizardPrefill): WizardState {
  return {
    currentStepIndex: 0,
    reportType: prefill?.reportType ?? null,
    selectedProject: prefill?.projectId
      ? {
          id: prefill.projectId,
          name: prefill.projectName ?? '',
          address: '',
        }
      : null,
    projectFreetext: '',
    showProjectPicker: !!prefill?.projectId,
    // property
    propertyAddress: prefill?.propertyAddress ?? '',
    apartmentLabel: prefill?.apartmentLabel ?? '',
    propertyFloor:
      prefill?.apartmentFloor !== null && prefill?.apartmentFloor !== undefined
        ? String(prefill.apartmentFloor)
        : '',
    propertyArea: '',
    propertyType: '',
    apartmentId: prefill?.apartmentId ?? null,
    // client
    tenantName: '',
    tenantPhone: '',
    tenantEmail: '',
    clientIdNumber: '',
    // template
    checklistTemplateId: null,
    noChecklist: false,
    // draft mode
    isDraft: false,
    // meta
    isSubmitting: false,
  };
}

// --- Reducer ---

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_REPORT_TYPE':
      return {
        ...state,
        reportType: action.payload,
        // Template will be auto-set via useEffect when profile.preferences is available
      };
    case 'SET_PROJECT':
      return {
        ...state,
        selectedProject: action.payload,
        projectFreetext: '',
        showProjectPicker: true,
        // Auto-set template from project default
        checklistTemplateId:
          action.payload.defaultTemplateId ?? state.checklistTemplateId,
      };
    case 'SET_PROJECT_FREETEXT':
      return {
        ...state,
        projectFreetext: action.payload,
        selectedProject: null,
      };
    case 'CLEAR_PROJECT':
      return {
        ...state,
        selectedProject: null,
        projectFreetext: '',
        showProjectPicker: false,
      };
    case 'TOGGLE_PROJECT_PICKER':
      return {
        ...state,
        showProjectPicker: action.payload,
        // Clear project data when toggling off
        ...(action.payload
          ? {}
          : { selectedProject: null, projectFreetext: '' }),
      };
    case 'SET_PROPERTY_ADDRESS':
      return { ...state, propertyAddress: action.payload };
    case 'SET_APARTMENT_LABEL':
      return { ...state, apartmentLabel: action.payload };
    case 'SET_PROPERTY_FLOOR':
      return { ...state, propertyFloor: action.payload };
    case 'SET_PROPERTY_AREA':
      return { ...state, propertyArea: action.payload };
    case 'SET_PROPERTY_TYPE':
      return { ...state, propertyType: action.payload };
    case 'SET_TENANT_NAME':
      return { ...state, tenantName: action.payload };
    case 'SET_TENANT_PHONE':
      return { ...state, tenantPhone: action.payload };
    case 'SET_TENANT_EMAIL':
      return { ...state, tenantEmail: action.payload };
    case 'SET_CLIENT_ID_NUMBER':
      return { ...state, clientIdNumber: action.payload };
    case 'SET_CHECKLIST_TEMPLATE':
      return { ...state, checklistTemplateId: action.payload };
    case 'TOGGLE_NO_CHECKLIST':
      return { ...state, noChecklist: action.payload };
    case 'TOGGLE_DRAFT':
      return { ...state, isDraft: action.payload };
    case 'NEXT_STEP':
      return { ...state, currentStepIndex: state.currentStepIndex + 1 };
    case 'PREV_STEP':
      return {
        ...state,
        currentStepIndex: Math.max(0, state.currentStepIndex - 1),
      };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'RESET':
      return createInitialState();
    default:
      return state;
  }
}

// --- Compute visible steps (always 3) ---

function computeVisibleSteps(): WizardStepId[] {
  return ['report_type', 'property', 'client_details'];
}

// --- Hook ---

export function useWizardState(
  prefill?: WizardPrefill,
  onClose?: () => void,
  visible?: boolean
) {
  const [state, dispatch] = useReducer(
    wizardReducer,
    prefill,
    createInitialState
  );
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset when wizard becomes visible
  useEffect(() => {
    if (visible) {
      dispatch({ type: 'RESET' });
      // Re-apply prefill if provided
      if (prefill?.reportType) {
        dispatch({ type: 'SET_REPORT_TYPE', payload: prefill.reportType });
      }
      if (prefill?.projectId) {
        dispatch({
          type: 'SET_PROJECT',
          payload: {
            id: prefill.projectId,
            name: prefill.projectName ?? '',
            address: '',
          },
        });
      }
      if (prefill?.apartmentLabel) {
        dispatch({
          type: 'SET_APARTMENT_LABEL',
          payload: prefill.apartmentLabel,
        });
      }
      if (prefill?.propertyAddress) {
        dispatch({
          type: 'SET_PROPERTY_ADDRESS',
          payload: prefill.propertyAddress,
        });
      }
      if (
        prefill?.apartmentFloor !== null &&
        prefill?.apartmentFloor !== undefined
      ) {
        dispatch({
          type: 'SET_PROPERTY_FLOOR',
          payload: String(prefill.apartmentFloor),
        });
      }

      // Auto-set user's default template if available
      const rt = prefill?.reportType ?? null;
      if (rt && profile?.preferences) {
        const defaultId =
          rt === 'bedek_bait'
            ? profile.preferences.defaultTemplateBedekBait
            : profile.preferences.defaultTemplateDelivery;
        if (defaultId) {
          dispatch({ type: 'SET_CHECKLIST_TEMPLATE', payload: defaultId });
        }
      }
    }
  }, [visible, prefill, profile?.preferences]);

  // Auto-set default template when report type changes (and no project default set)
  useEffect(() => {
    if (!state.reportType || !profile?.preferences) return;
    // Don't override if project already set a template
    if (state.selectedProject?.defaultTemplateId) return;

    const defaultId =
      state.reportType === 'bedek_bait'
        ? profile.preferences.defaultTemplateBedekBait
        : profile.preferences.defaultTemplateDelivery;

    if (defaultId && defaultId !== state.checklistTemplateId) {
      dispatch({ type: 'SET_CHECKLIST_TEMPLATE', payload: defaultId });
    }
  }, [
    state.reportType,
    profile?.preferences,
    state.selectedProject?.defaultTemplateId,
    state.checklistTemplateId,
  ]);

  const visibleSteps = useMemo(() => computeVisibleSteps(), []);

  const currentStepId = visibleSteps[state.currentStepIndex] ?? 'report_type';
  const isLastStep = state.currentStepIndex >= visibleSteps.length - 1;

  const canGoNext = useMemo(() => {
    switch (currentStepId) {
      case 'report_type':
        return state.reportType !== null;
      case 'property':
        // All fields optional — always allow proceeding
        return true;
      case 'client_details':
        // All fields optional — always allow proceeding
        return true;
      default:
        return false;
    }
  }, [currentStepId, state.reportType]);

  // Determine if a step is pre-filled (read-only)
  const isStepPrefilled = useCallback(
    (stepId: WizardStepId): boolean => {
      if (!prefill) return false;
      switch (stepId) {
        case 'report_type':
          return !!prefill.reportType;
        default:
          return false;
      }
    },
    [prefill]
  );

  // Submit: create report in DB + navigate
  const handleSubmit = useCallback(async () => {
    if (state.isSubmitting) return;

    // Profile may be stale (e.g. after db reset while session persists).
    // Refresh once before giving up.
    const currentProfile = profile ?? (await refreshProfile());
    if (!currentProfile) {
      setSubmitError('לא נמצא פרופיל משתמש. נסה להתחבר מחדש.');
      return;
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      const apartmentId = state.apartmentId;

      // Auto-detect delivery round for this apartment
      let roundNumber = 1;
      let previousRoundId: string | null = null;

      if (state.reportType === 'delivery' && apartmentId) {
        const { data: prevReport } = await supabase
          .from('delivery_reports')
          .select('id, round_number')
          .eq('apartment_id', apartmentId)
          .eq('report_type', 'delivery')
          .order('round_number', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (prevReport) {
          roundNumber = (prevReport.round_number as number) + 1;
          previousRoundId = prevReport.id as string;
        }
      }

      const { id: reportId } = await createReportWithSnapshot({
        apartmentId: apartmentId ?? null,
        organizationId: currentProfile.organizationId,
        inspectorId: currentProfile.id,
        reportType: state.reportType as ReportType,
        roundNumber,
        previousRoundId,
        reportDate: new Date().toISOString().split('T')[0],
        projectNameFreetext:
          state.selectedProject?.name || state.projectFreetext.trim() || null,
        apartmentLabelFreetext: state.apartmentLabel.trim() || null,
        tenantName: state.tenantName.trim() || null,
        tenantPhone: state.tenantPhone.trim() || null,
        tenantEmail: state.tenantEmail.trim() || null,
        clientIdNumber: state.clientIdNumber.trim() || null,
        propertyAddress: state.propertyAddress.trim() || null,
        propertyFloor: state.propertyFloor
          ? parseInt(state.propertyFloor, 10)
          : null,
        propertyArea: state.propertyArea
          ? parseFloat(state.propertyArea)
          : null,
        propertyType: state.propertyType.trim() || null,
        checklistTemplateId: state.noChecklist
          ? null
          : state.checklistTemplateId,
        noChecklist: state.noChecklist,
        isDraft: state.isDraft,
      });

      // Round 2+: copy unresolved defects forward from the previous round.
      // Marks each copy as `source = 'inherited'` with `review_status = 'pending_review'`.
      if (previousRoundId) {
        try {
          await copyInheritedDefects({
            newReportId: reportId,
            previousRoundId,
          });
        } catch (copyErr) {
          // Non-fatal: report exists, user can add defects manually.
          console.error(
            '[useWizardState] copyInheritedDefects failed:',
            copyErr
          );
        }
      }

      // Reset submitting state before closing
      dispatch({ type: 'SET_SUBMITTING', payload: false });

      // Close wizard first, then navigate after Modal unmounts
      onClose?.();

      // Wait for Modal animation to complete before navigating.
      // Use both InteractionManager and a fallback timeout to prevent freeze.
      let navigated = false;
      const navigate = () => {
        if (navigated) return;
        navigated = true;
        router.push(`/(app)/reports/${reportId}`);
      };

      InteractionManager.runAfterInteractions(navigate);
      // Fallback: if InteractionManager doesn't fire (e.g. web), navigate after 500ms
      setTimeout(navigate, 500);
    } catch (err) {
      console.error('[useWizardState] handleSubmit failed:', err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'שגיאה לא ידועה';
      setSubmitError(`${message}\n\nנסה שוב.`);
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, [profile, refreshProfile, state, onClose, router]);

  const clearSubmitError = useCallback(() => setSubmitError(null), []);

  return {
    state,
    dispatch,
    visibleSteps,
    currentStepId,
    isLastStep,
    canGoNext,
    isStepPrefilled,
    handleSubmit,
    submitError,
    clearSubmitError,
  };
}
