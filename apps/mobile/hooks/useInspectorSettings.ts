import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { REPORT_DEFAULTS } from '@infield/shared/src/constants/reportDefaults';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// --- Types ---

export interface InspectorSettings {
  // Professional profile fields
  license_number?: string;
  education?: string;
  experience?: string;
  company_name?: string;
  company_logo_url?: string;

  // Report text defaults (override REPORT_DEFAULTS from shared)
  default_declaration?: string;
  default_tools?: string;
  default_limitations?: string;
  work_method?: string;
  standards_boilerplate?: string[];
  tenant_rights_text?: string;
  warranty_periods?: { desc: string; period: string }[];
  required_docs?: string[];
  financial_notes?: string[];
  disclaimer?: string;
  inspector_declaration?: string;
  tenant_acknowledgment?: string;
  protocol_terms?: string;

  // Visibility flags — control whether each section appears in PDF
  show_declaration?: boolean;
  show_work_method?: boolean;
  show_tools?: boolean;
  show_limitations?: boolean;
  show_standards?: boolean;
  show_tenant_rights?: boolean;
  show_warranty_periods?: boolean;
  show_required_docs?: boolean;
  show_financial_notes?: boolean;
  show_disclaimer?: boolean;
  show_inspector_declaration?: boolean;
  show_tenant_acknowledgment?: boolean;
  show_protocol_terms?: boolean;
}

/** Raw settings as stored in DB (without defaults merged in) */
export type RawInspectorSettings = InspectorSettings;

/** Settings merged with system defaults — every report-text field has a value */
export type MergedInspectorSettings = InspectorSettings &
  typeof REPORT_DEFAULTS;

// --- Query Key ---

export const inspectorSettingsKeys = {
  all: ['inspector-settings'] as const,
  detail: (userId: string) => [...inspectorSettingsKeys.all, userId] as const,
};

// --- Fetcher ---

async function fetchInspectorSettings(
  userId: string
): Promise<InspectorSettings> {
  const { data, error } = await supabase
    .from('users')
    .select('inspector_settings')
    .eq('id', userId)
    .single();

  if (error) throw error;

  return (data?.inspector_settings as InspectorSettings) ?? {};
}

// --- Updater ---

async function persistInspectorSettings(
  userId: string,
  settings: InspectorSettings
): Promise<InspectorSettings> {
  const { data, error } = await supabase
    .from('users')
    .update({ inspector_settings: settings })
    .eq('id', userId)
    .select('inspector_settings')
    .single();

  if (error) throw error;

  return (data?.inspector_settings as InspectorSettings) ?? {};
}

// --- Merge helper ---

function mergeWithDefaults(raw: InspectorSettings): MergedInspectorSettings {
  const merged = { ...REPORT_DEFAULTS } as Record<string, unknown>;
  for (const [key, value] of Object.entries(raw)) {
    if (value !== undefined && value !== null && value !== '') {
      merged[key] = value;
    }
  }
  return merged as unknown as MergedInspectorSettings;
}

// --- Hook ---

export function useInspectorSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? '';

  const query = useQuery({
    queryKey: inspectorSettingsKeys.detail(userId),
    queryFn: () => fetchInspectorSettings(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  // Raw settings from DB (no defaults merged)
  const rawSettings = useMemo(
    () => query.data ?? ({} as InspectorSettings),
    [query.data]
  );

  // Settings with system defaults merged in
  const settings = useMemo(() => mergeWithDefaults(rawSettings), [rawSettings]);

  const mutation = useMutation({
    mutationFn: (updated: InspectorSettings) =>
      persistInspectorSettings(userId, updated),
    onSuccess: (newSettings) => {
      queryClient.setQueryData(
        inspectorSettingsKeys.detail(userId),
        newSettings
      );
    },
  });

  // Explicit save — accepts the full settings object to persist
  const saveSettings = useCallback(
    (updated: InspectorSettings) => {
      mutation.mutate(updated);
    },
    [mutation]
  );

  // Legacy alias for backward compatibility (partial merge)
  const updateSettings = useCallback(
    (partial: Partial<InspectorSettings>) => {
      const merged: InspectorSettings = { ...rawSettings, ...partial };
      mutation.mutate(merged);
    },
    [mutation, rawSettings]
  );

  return {
    /** Settings merged with system defaults */
    settings,
    /** Raw settings from DB (without defaults) */
    rawSettings,
    /** Explicit save — pass full settings object */
    saveSettings,
    /** Legacy: partial update (merges with current settings) */
    updateSettings,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    isSaved: mutation.isSuccess,
  };
}
