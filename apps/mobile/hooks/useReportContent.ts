import { useCallback, useEffect, useRef, useState } from 'react';

import { supabase } from '@/lib/supabase';

// --- Types ---

export interface ReportContent {
  declaration?: string;
  scope?: string;
  property_description?: string;
  limitations?: string;
  tools?: string;
  weather?: string;
  general_notes?: string;
}

export interface UseReportContentResult {
  content: ReportContent;
  updateSection: (key: keyof ReportContent, value: string) => void;
  initializeDefaults: (inspectorSettings: Record<string, unknown>) => void;
  isLoading: boolean;
  isSaving: boolean;
  defaultsLoaded: boolean;
}

// --- Helper: check if content is empty ---

function isContentEmpty(c: ReportContent): boolean {
  return Object.values(c).every((v) => !v || v.trim() === '');
}

// --- Hook ---

export function useReportContent(
  reportId: string | undefined
): UseReportContentResult {
  const [content, setContent] = useState<ReportContent>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [defaultsLoaded, setDefaultsLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch on mount
  useEffect(() => {
    if (!reportId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetch() {
      try {
        const { data, error } = await supabase
          .from('delivery_reports')
          .select('report_content')
          .eq('id', reportId)
          .single();

        if (error) throw error;
        if (!cancelled) {
          setContent((data?.report_content as ReportContent) ?? {});
        }
      } catch {
        // Keep empty content on error
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  // Save to Supabase (debounced)
  const saveToSupabase = useCallback(
    (updated: ReportContent) => {
      if (!reportId) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          await supabase
            .from('delivery_reports')
            .update({ report_content: updated })
            .eq('id', reportId);
        } catch {
          // Silent fail — user can retry
        } finally {
          setIsSaving(false);
        }
      }, 1000);
    },
    [reportId]
  );

  // Update a single section
  const updateSection = useCallback(
    (key: keyof ReportContent, value: string) => {
      setContent((prev) => {
        const updated = { ...prev, [key]: value };
        saveToSupabase(updated);
        return updated;
      });
    },
    [saveToSupabase]
  );

  // Initialize from inspector settings defaults
  const initializeDefaults = useCallback(
    (inspectorSettings: Record<string, unknown>) => {
      if (defaultsLoaded || isLoading || !isContentEmpty(content)) return;

      const defaults: ReportContent = {};
      let hasDefaults = false;

      if (inspectorSettings.default_declaration) {
        defaults.declaration = String(inspectorSettings.default_declaration);
        hasDefaults = true;
      }
      if (inspectorSettings.default_tools) {
        defaults.tools = String(inspectorSettings.default_tools);
        hasDefaults = true;
      }
      if (inspectorSettings.default_limitations) {
        defaults.limitations = String(inspectorSettings.default_limitations);
        hasDefaults = true;
      }

      if (hasDefaults) {
        setContent(defaults);
        setDefaultsLoaded(true);
        saveToSupabase(defaults);
      }
    },
    [content, isLoading, defaultsLoaded, saveToSupabase]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    content,
    updateSection,
    initializeDefaults,
    isLoading,
    isSaving,
    defaultsLoaded,
  };
}
