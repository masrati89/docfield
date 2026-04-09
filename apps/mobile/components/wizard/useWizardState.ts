import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { Alert, InteractionManager } from 'react-native';
import { useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { createReportWithSnapshot } from '@/lib/createReportWithSnapshot';
import { useAuth } from '@/contexts/AuthContext';

import type {
  WizardState,
  WizardAction,
  WizardStepId,
  WizardPrefill,
  ReportType,
  NewBuildingEntry,
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
    projectSkipped: false,
    newBuildings: [{ name: 'בניין 1' }],
    newApartmentCounts: { 0: 1 },
    selectedApartment: prefill?.apartmentId
      ? {
          id: prefill.apartmentId,
          number: prefill.apartmentLabel ?? '',
          floor: null,
          status: '',
          buildingId: '',
          buildingName: prefill.buildingName ?? '',
        }
      : null,
    apartmentFreetext: '',
    tenantName: '',
    tenantPhone: '',
    tenantEmail: '',
    protocolMode: null,
    selectedTemplate: null,
    isSubmitting: false,
  };
}

// --- Reducer ---

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_REPORT_TYPE':
      return { ...state, reportType: action.payload };
    case 'SET_PROJECT':
      return {
        ...state,
        selectedProject: action.payload,
        projectFreetext: '',
        projectSkipped: false,
      };
    case 'SET_PROJECT_FREETEXT':
      return {
        ...state,
        projectFreetext: action.payload,
        selectedProject: null,
        projectSkipped: false,
      };
    case 'CLEAR_PROJECT':
      return {
        ...state,
        selectedProject: null,
        projectFreetext: '',
        projectSkipped: false,
        selectedApartment: null,
        apartmentFreetext: '',
      };
    case 'SKIP_PROJECT': {
      const skippedState = {
        ...state,
        projectSkipped: true,
        selectedProject: null,
        projectFreetext: '',
        selectedApartment: null,
        apartmentFreetext: '',
      };
      // Compute new visible steps after skip and advance to the step after 'project'
      const newSteps = computeVisibleSteps(skippedState);
      const projectIdx = newSteps.indexOf('project');
      const nextIdx =
        projectIdx >= 0 ? projectIdx + 1 : state.currentStepIndex + 1;
      return {
        ...skippedState,
        currentStepIndex: Math.min(nextIdx, newSteps.length - 1),
      };
    }
    case 'SET_BUILDINGS_COUNT': {
      const count = Math.max(1, Math.min(20, action.payload));
      const buildings: NewBuildingEntry[] = Array.from(
        { length: count },
        (_, i) => state.newBuildings[i] ?? { name: `בניין ${i + 1}` }
      );
      // Keep existing apartment counts, remove excess
      const counts: Record<number, number> = {};
      for (let i = 0; i < count; i++) {
        counts[i] = state.newApartmentCounts[i] ?? 1;
      }
      return {
        ...state,
        newBuildings: buildings,
        newApartmentCounts: counts,
        selectedApartment: null,
        apartmentFreetext: '',
      };
    }
    case 'SET_BUILDING_NAME': {
      const buildings = [...state.newBuildings];
      if (buildings[action.payload.index]) {
        buildings[action.payload.index] = { name: action.payload.name };
      }
      return { ...state, newBuildings: buildings };
    }
    case 'SET_APARTMENT_COUNT': {
      const clamped = Math.max(1, Math.min(200, action.payload.count));
      return {
        ...state,
        newApartmentCounts: {
          ...state.newApartmentCounts,
          [action.payload.buildingIndex]: clamped,
        },
        selectedApartment: null,
        apartmentFreetext: '',
      };
    }
    case 'SET_APARTMENT':
      return {
        ...state,
        selectedApartment: action.payload,
        apartmentFreetext: '',
      };
    case 'SET_APARTMENT_FREETEXT':
      return {
        ...state,
        apartmentFreetext: action.payload,
        selectedApartment: null,
      };
    case 'SET_TENANT_NAME':
      return { ...state, tenantName: action.payload };
    case 'SET_TENANT_PHONE':
      return { ...state, tenantPhone: action.payload };
    case 'SET_TENANT_EMAIL':
      return { ...state, tenantEmail: action.payload };
    case 'SET_PROTOCOL_MODE':
      return {
        ...state,
        protocolMode: action.payload,
        selectedTemplate:
          action.payload === 'empty_protocol' ? null : state.selectedTemplate,
      };
    case 'SET_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
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

// --- Compute visible steps ---

function computeVisibleSteps(
  state: WizardState,
  prefill?: WizardPrefill
): WizardStepId[] {
  const steps: WizardStepId[] = ['report_type'];

  // Skip project + apartment steps if both are prefilled
  if (prefill?.projectId && prefill?.apartmentId) {
    // Everything is pre-selected — just pick report type (and protocol for delivery)
  } else if (prefill?.projectId) {
    // Project prefilled, need apartment selection
    steps.push('apartment');
  } else {
    // No prefill — full flow
    steps.push('project');

    if (state.projectFreetext.trim() && !state.projectSkipped) {
      steps.push('buildings', 'apartment_counts', 'apartment');
    } else if (state.selectedProject && !state.projectSkipped) {
      steps.push('apartment');
    }
  }

  // Client details step: only for bedek_bait reports
  if (state.reportType === 'bedek_bait') {
    steps.push('client_details');
  }

  // Protocol step: only for delivery reports
  if (state.reportType === 'delivery') {
    steps.push('protocol');
  }

  return steps;
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
  const { profile } = useAuth();

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
      if (prefill?.apartmentId) {
        dispatch({
          type: 'SET_APARTMENT',
          payload: {
            id: prefill.apartmentId,
            number: prefill.apartmentLabel ?? '',
            floor: null,
            status: '',
            buildingId: '',
            buildingName: prefill.buildingName ?? '',
          },
        });
      }
    }
  }, [visible, prefill]);

  const visibleSteps = useMemo(
    () => computeVisibleSteps(state, prefill),
    [state, prefill]
  );

  const currentStepId = visibleSteps[state.currentStepIndex] ?? 'report_type';
  const isLastStep = state.currentStepIndex >= visibleSteps.length - 1;

  const canGoNext = useMemo(() => {
    switch (currentStepId) {
      case 'report_type':
        return state.reportType !== null;
      case 'project':
        // Need either existing project, freetext, or skip
        return (
          state.selectedProject !== null ||
          state.projectFreetext.trim().length > 0 ||
          state.projectSkipped
        );
      case 'buildings':
        // All buildings must have a name
        return state.newBuildings.every((b) => b.name.trim().length > 0);
      case 'apartment_counts':
        // All buildings must have at least 1 apartment
        return state.newBuildings.every(
          (_, i) => (state.newApartmentCounts[i] ?? 0) >= 1
        );
      case 'apartment':
        // Apartment is optional per FLOW_SPEC §3 — always allow proceeding
        return true;
      case 'client_details':
        // Name is required, phone and email are optional
        return state.tenantName.trim().length >= 2;
      case 'protocol':
        return state.protocolMode !== null;
      default:
        return false;
    }
  }, [currentStepId, state]);

  // Determine if a step is pre-filled (read-only)
  const isStepPrefilled = useCallback(
    (stepId: WizardStepId): boolean => {
      if (!prefill) return false;
      switch (stepId) {
        case 'report_type':
          return !!prefill.reportType;
        case 'project':
          return !!prefill.projectId;
        case 'apartment':
          return !!prefill.apartmentId;
        default:
          return false;
      }
    },
    [prefill]
  );

  // Handle "skip project" → advance past project step, auto-submit only if no more steps
  const pendingSubmitRef = useRef(false);

  const handleSkipProject = useCallback(() => {
    dispatch({ type: 'SKIP_PROJECT' });
    // Both report types now have a final step after project skip:
    // bedek_bait → client_details, delivery → protocol
    // So we never auto-submit on skip anymore.
  }, []);

  // Submit: create report in DB + navigate
  const handleSubmit = useCallback(async () => {
    if (state.isSubmitting) return;

    if (!profile) {
      Alert.alert('שגיאה', 'לא נמצא פרופיל משתמש. נסה להתחבר מחדש.');
      return;
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      let apartmentId = state.selectedApartment?.id ?? null;

      // --- Create new project + buildings + apartments if freetext ---
      if (state.projectFreetext.trim() && !state.selectedProject) {
        let projectId: string | null = null;

        try {
          // 1. Create project
          const { data: newProject, error: projErr } = await supabase
            .from('projects')
            .insert({
              organization_id: profile.organizationId,
              name: state.projectFreetext.trim(),
              status: 'active',
            })
            .select('id')
            .single();

          if (projErr || !newProject)
            throw projErr ?? new Error('שגיאה ביצירת פרויקט');

          projectId = newProject.id as string;

          // 2. Create buildings
          const buildingInserts = state.newBuildings.map((b) => ({
            project_id: projectId!,
            organization_id: profile.organizationId,
            name: b.name.trim(),
          }));

          const { data: newBuildings, error: buildErr } = await supabase
            .from('buildings')
            .insert(buildingInserts)
            .select('id');

          if (buildErr || !newBuildings)
            throw buildErr ?? new Error('שגיאה ביצירת בניינים');

          // 3. Create apartments for each building
          const apartmentInserts: Array<{
            building_id: string;
            organization_id: string;
            number: string;
            floor: number;
            status: string;
          }> = [];

          for (let bi = 0; bi < newBuildings.length; bi++) {
            const count = state.newApartmentCounts[bi] ?? 1;
            const buildingId = newBuildings[bi].id as string;
            for (let ai = 1; ai <= count; ai++) {
              apartmentInserts.push({
                building_id: buildingId,
                organization_id: profile.organizationId,
                number: String(ai),
                floor: 0,
                status: 'pending',
              });
            }
          }

          if (apartmentInserts.length > 0) {
            const { error: aptErr } = await supabase
              .from('apartments')
              .insert(apartmentInserts);
            if (aptErr) throw aptErr;
          }

          // 4. Resolve selected apartment ID
          if (state.selectedApartment?.id) {
            // The selected apartment has a temporary local ID — find the real one
            // by matching building index + apartment number
            const localId = state.selectedApartment.id;
            const match = localId.match(/^new-(\d+)-(\d+)$/);
            if (match) {
              const bIdx = parseInt(match[1], 10);
              const aptNum = match[2];
              const realBuildingId = newBuildings[bIdx]?.id as
                | string
                | undefined;
              if (realBuildingId) {
                const { data: realApt } = await supabase
                  .from('apartments')
                  .select('id')
                  .eq('building_id', realBuildingId)
                  .eq('number', aptNum)
                  .limit(1)
                  .maybeSingle();
                if (realApt) {
                  apartmentId = realApt.id as string;
                }
              }
            }
          }
        } catch (createErr) {
          // Rollback: delete orphan project if buildings/apartments failed
          if (projectId) {
            await supabase.from('projects').delete().eq('id', projectId);
          }
          throw createErr;
        }
      }

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
        organizationId: profile.organizationId,
        inspectorId: profile.id,
        reportType: state.reportType as ReportType,
        roundNumber,
        previousRoundId,
        reportDate: new Date().toISOString().split('T')[0],
        projectNameFreetext:
          state.projectFreetext.trim() || state.selectedProject?.name || null,
        apartmentLabelFreetext:
          state.apartmentFreetext.trim() ||
          (state.selectedApartment
            ? `דירה ${state.selectedApartment.number}`
            : null),
        tenantName: state.tenantName.trim() || null,
        tenantPhone: state.tenantPhone.trim() || null,
        tenantEmail: state.tenantEmail.trim() || null,
      });

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
      const message = err instanceof Error ? err.message : 'שגיאה לא ידועה';
      Alert.alert('שגיאה ביצירת הדוח', `${message}\n\nנסה שוב.`);
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, [profile, state, onClose, router]);

  // Auto-submit after skip project — wait for state to update before submitting
  useEffect(() => {
    if (pendingSubmitRef.current && state.projectSkipped) {
      pendingSubmitRef.current = false;
      handleSubmit();
    }
  }, [state.projectSkipped, handleSubmit]);

  return {
    state,
    dispatch,
    visibleSteps,
    currentStepId,
    isLastStep,
    canGoNext,
    isStepPrefilled,
    handleSkipProject,
    handleSubmit,
  };
}
