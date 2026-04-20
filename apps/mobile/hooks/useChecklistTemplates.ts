import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { UserPreferences } from '@infield/shared';

// --- Types ---

export interface ChecklistTemplateSummary {
  id: string;
  name: string;
  report_type: string;
  is_global: boolean;
  is_active: boolean;
  category_count: number;
}

// --- Query Keys ---

export const checklistTemplateKeys = {
  all: ['checklist-templates'] as const,
  list: (orgId: string) =>
    [...checklistTemplateKeys.all, 'list', orgId] as const,
  detail: (id: string) => [...checklistTemplateKeys.all, 'detail', id] as const,
};

// --- Hook ---

export function useChecklistTemplates() {
  const { profile, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const orgId = profile?.organizationId ?? '';

  const query = useQuery({
    queryKey: checklistTemplateKeys.list(orgId),
    queryFn: async (): Promise<ChecklistTemplateSummary[]> => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .select(
          'id, name, report_type, is_global, is_active, checklist_categories(id)'
        )
        .order('is_global', { ascending: false })
        .order('name');

      if (error) throw error;

      return (data ?? []).map((t) => ({
        id: t.id,
        name: t.name,
        report_type: t.report_type,
        is_global: t.is_global,
        is_active: t.is_active,
        category_count:
          (t.checklist_categories as { id: string }[])?.length ?? 0,
      }));
    },
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
  });

  // --- Create empty template ---
  const createMutation = useMutation({
    mutationFn: async ({
      name,
      reportType = 'delivery',
    }: {
      name: string;
      reportType?: string;
    }) => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .insert({
          organization_id: orgId,
          name,
          report_type: reportType,
          is_global: false,
          is_active: true,
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: checklistTemplateKeys.list(orgId),
      });
    },
  });

  // --- Duplicate template (deep copy) ---
  const duplicateMutation = useMutation({
    mutationFn: async ({
      sourceId,
      newName,
    }: {
      sourceId: string;
      newName: string;
    }) => {
      // 1. Fetch source template with categories + items
      const { data: source, error: fetchErr } = await supabase
        .from('checklist_templates')
        .select(
          'report_type, checklist_categories(id, name, sort_order, checklist_items(description, default_severity, requires_photo, sort_order, metadata))'
        )
        .eq('id', sourceId)
        .single();

      if (fetchErr || !source) throw fetchErr ?? new Error('תבנית לא נמצאה');

      // 2. Create new template
      const { data: newTemplate, error: insertErr } = await supabase
        .from('checklist_templates')
        .insert({
          organization_id: orgId,
          name: newName,
          report_type: source.report_type,
          is_global: false,
          is_active: true,
        })
        .select('id')
        .single();

      if (insertErr || !newTemplate)
        throw insertErr ?? new Error('שגיאה ביצירת תבנית');

      const newTemplateId = newTemplate.id as string;

      // 3. Copy categories + items
      const categories = (source.checklist_categories ?? []) as {
        id: string;
        name: string;
        sort_order: number;
        checklist_items: {
          description: string;
          default_severity: string;
          requires_photo: boolean;
          sort_order: number;
          metadata: Record<string, unknown>;
        }[];
      }[];

      for (const cat of categories) {
        const { data: newCat, error: catErr } = await supabase
          .from('checklist_categories')
          .insert({
            template_id: newTemplateId,
            name: cat.name,
            sort_order: cat.sort_order,
          })
          .select('id')
          .single();

        if (catErr || !newCat) continue;

        const items = (cat.checklist_items ?? []).map((item) => ({
          category_id: newCat.id as string,
          description: item.description,
          default_severity: item.default_severity,
          requires_photo: item.requires_photo,
          sort_order: item.sort_order,
          metadata: item.metadata ?? {},
        }));

        if (items.length > 0) {
          await supabase.from('checklist_items').insert(items);
        }
      }

      return newTemplateId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: checklistTemplateKeys.list(orgId),
      });
    },
  });

  // --- Delete template ---
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('checklist_templates')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: checklistTemplateKeys.list(orgId),
      });
    },
  });

  // --- Rename template ---
  const renameMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from('checklist_templates')
        .update({ name })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: checklistTemplateKeys.list(orgId),
      });
    },
  });

  const createTemplate = useCallback(
    (name: string, reportType?: string) =>
      createMutation.mutateAsync({ name, reportType }),
    [createMutation]
  );

  const duplicateTemplate = useCallback(
    (sourceId: string, newName: string) =>
      duplicateMutation.mutateAsync({ sourceId, newName }),
    [duplicateMutation]
  );

  const deleteTemplate = useCallback(
    (id: string) => deleteMutation.mutateAsync(id),
    [deleteMutation]
  );

  const renameTemplate = useCallback(
    (id: string, name: string) => renameMutation.mutateAsync({ id, name }),
    [renameMutation]
  );

  // --- Set default template for a report type ---
  const setDefaultTemplateMutation = useMutation({
    mutationFn: async ({
      reportType,
      templateId,
    }: {
      reportType: string;
      templateId: string | null;
    }) => {
      const userId = profile?.id;
      if (!userId) throw new Error('No user');

      const prefKey =
        reportType === 'bedek_bait'
          ? 'defaultTemplateBedekBait'
          : 'defaultTemplateDelivery';

      // Fetch current preferences to merge
      const { data: currentUser, error: fetchErr } = await supabase
        .from('users')
        .select('preferences')
        .eq('id', userId)
        .single();

      if (fetchErr) throw fetchErr;

      const currentPrefs = (currentUser.preferences as UserPreferences) ?? {};
      const updatedPrefs = {
        ...currentPrefs,
        [prefKey]: templateId,
      };

      const { error } = await supabase
        .from('users')
        .update({ preferences: updatedPrefs })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Refresh AuthContext profile so wizard sees updated preferences
      refreshProfile();
    },
  });

  const setDefaultTemplate = useCallback(
    (reportType: string, templateId: string | null) =>
      setDefaultTemplateMutation.mutateAsync({ reportType, templateId }),
    [setDefaultTemplateMutation]
  );

  return {
    templates: query.data ?? [],
    isLoading: query.isLoading,
    isCreating: createMutation.isPending,
    isDuplicating: duplicateMutation.isPending,
    createTemplate,
    duplicateTemplate,
    deleteTemplate,
    renameTemplate,
    setDefaultTemplate,
  };
}
