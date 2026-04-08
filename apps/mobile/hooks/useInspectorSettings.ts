import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// --- Types ---

export interface InspectorSettings {
  license_number?: string;
  education?: string;
  experience?: string;
  company_name?: string;
  company_logo_url?: string;
  default_declaration?: string;
  default_tools?: string;
  default_limitations?: string;
}

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

async function saveInspectorSettings(
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

  const mutation = useMutation({
    mutationFn: (partial: Partial<InspectorSettings>) => {
      const current = query.data ?? {};
      const merged: InspectorSettings = { ...current, ...partial };
      return saveInspectorSettings(userId, merged);
    },
    onSuccess: (newSettings) => {
      queryClient.setQueryData(
        inspectorSettingsKeys.detail(userId),
        newSettings
      );
    },
  });

  const updateSettings = useCallback(
    (partial: Partial<InspectorSettings>) => {
      mutation.mutate(partial);
    },
    [mutation]
  );

  return {
    settings: query.data ?? ({} as InspectorSettings),
    updateSettings,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    isSaved: mutation.isSuccess,
  };
}
