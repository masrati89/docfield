import { useCallback, useMemo } from 'react';

import {
  useInspectorSettings,
  type InspectorSettings,
} from '@/hooks/useInspectorSettings';

// --- Types ---

/** All report-text fields + their visibility toggles */
export interface ReportDefaults {
  // Text fields
  declaration: string;
  work_method: string;
  default_tools: string;
  default_limitations: string;
  standards_boilerplate: string[];
  tenant_rights_text: string;
  warranty_periods: { desc: string; period: string }[];
  required_docs: string[];
  financial_notes: string[];
  disclaimer: string;
  inspector_declaration: string;
  tenant_acknowledgment: string;
  protocol_terms: string;

  // Visibility flags
  show_declaration: boolean;
  show_work_method: boolean;
  show_tools: boolean;
  show_limitations: boolean;
  show_standards: boolean;
  show_tenant_rights: boolean;
  show_warranty_periods: boolean;
  show_required_docs: boolean;
  show_financial_notes: boolean;
  show_disclaimer: boolean;
  show_inspector_declaration: boolean;
  show_tenant_acknowledgment: boolean;
  show_protocol_terms: boolean;
}

// --- Hook ---

export function useReportDefaults() {
  const { settings, rawSettings, saveSettings, isLoading, isSaving, isSaved } =
    useInspectorSettings();

  // Extract only report-related fields from merged settings
  const reportDefaults = useMemo<ReportDefaults>(
    () => ({
      // Text fields (merged with system defaults — always have a value)
      declaration: settings.default_declaration ?? '',
      work_method: settings.work_method ?? '',
      default_tools: settings.default_tools ?? '',
      default_limitations: settings.default_limitations ?? '',
      standards_boilerplate: settings.standards_boilerplate ?? [],
      tenant_rights_text: settings.tenant_rights_text ?? '',
      warranty_periods: settings.warranty_periods ?? [],
      required_docs: settings.required_docs ?? [],
      financial_notes: settings.financial_notes ?? [],
      disclaimer: settings.disclaimer ?? '',
      inspector_declaration: settings.inspector_declaration ?? '',
      tenant_acknowledgment: settings.tenant_acknowledgment ?? '',
      protocol_terms: settings.protocol_terms ?? '',

      // Visibility flags (default to true — show everything by default)
      show_declaration: settings.show_declaration ?? true,
      show_work_method: settings.show_work_method ?? true,
      show_tools: settings.show_tools ?? true,
      show_limitations: settings.show_limitations ?? true,
      show_standards: settings.show_standards ?? true,
      show_tenant_rights: settings.show_tenant_rights ?? true,
      show_warranty_periods: settings.show_warranty_periods ?? true,
      show_required_docs: settings.show_required_docs ?? true,
      show_financial_notes: settings.show_financial_notes ?? true,
      show_disclaimer: settings.show_disclaimer ?? true,
      show_inspector_declaration: settings.show_inspector_declaration ?? true,
      show_tenant_acknowledgment: settings.show_tenant_acknowledgment ?? true,
      show_protocol_terms: settings.show_protocol_terms ?? true,
    }),
    [settings]
  );

  // Save report defaults back to inspector_settings
  const saveReportDefaults = useCallback(
    (updates: Partial<ReportDefaults>) => {
      // Map ReportDefaults keys back to InspectorSettings keys
      const patch: Partial<InspectorSettings> = {};

      if (updates.declaration !== undefined)
        patch.default_declaration = updates.declaration;
      if (updates.work_method !== undefined)
        patch.work_method = updates.work_method;
      if (updates.default_tools !== undefined)
        patch.default_tools = updates.default_tools;
      if (updates.default_limitations !== undefined)
        patch.default_limitations = updates.default_limitations;
      if (updates.standards_boilerplate !== undefined)
        patch.standards_boilerplate = updates.standards_boilerplate;
      if (updates.tenant_rights_text !== undefined)
        patch.tenant_rights_text = updates.tenant_rights_text;
      if (updates.warranty_periods !== undefined)
        patch.warranty_periods = updates.warranty_periods;
      if (updates.required_docs !== undefined)
        patch.required_docs = updates.required_docs;
      if (updates.financial_notes !== undefined)
        patch.financial_notes = updates.financial_notes;
      if (updates.disclaimer !== undefined)
        patch.disclaimer = updates.disclaimer;
      if (updates.inspector_declaration !== undefined)
        patch.inspector_declaration = updates.inspector_declaration;
      if (updates.tenant_acknowledgment !== undefined)
        patch.tenant_acknowledgment = updates.tenant_acknowledgment;
      if (updates.protocol_terms !== undefined)
        patch.protocol_terms = updates.protocol_terms;

      // Visibility flags pass through directly
      if (updates.show_declaration !== undefined)
        patch.show_declaration = updates.show_declaration;
      if (updates.show_work_method !== undefined)
        patch.show_work_method = updates.show_work_method;
      if (updates.show_tools !== undefined)
        patch.show_tools = updates.show_tools;
      if (updates.show_limitations !== undefined)
        patch.show_limitations = updates.show_limitations;
      if (updates.show_standards !== undefined)
        patch.show_standards = updates.show_standards;
      if (updates.show_tenant_rights !== undefined)
        patch.show_tenant_rights = updates.show_tenant_rights;
      if (updates.show_warranty_periods !== undefined)
        patch.show_warranty_periods = updates.show_warranty_periods;
      if (updates.show_required_docs !== undefined)
        patch.show_required_docs = updates.show_required_docs;
      if (updates.show_financial_notes !== undefined)
        patch.show_financial_notes = updates.show_financial_notes;
      if (updates.show_disclaimer !== undefined)
        patch.show_disclaimer = updates.show_disclaimer;
      if (updates.show_inspector_declaration !== undefined)
        patch.show_inspector_declaration = updates.show_inspector_declaration;
      if (updates.show_tenant_acknowledgment !== undefined)
        patch.show_tenant_acknowledgment = updates.show_tenant_acknowledgment;
      if (updates.show_protocol_terms !== undefined)
        patch.show_protocol_terms = updates.show_protocol_terms;

      saveSettings({ ...rawSettings, ...patch });
    },
    [rawSettings, saveSettings]
  );

  return {
    reportDefaults,
    saveReportDefaults,
    isLoading,
    isSaving,
    isSaved,
  };
}
