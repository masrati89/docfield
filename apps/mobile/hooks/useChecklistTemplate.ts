import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { checklistTemplateKeys } from './useChecklistTemplates';
import type {
  ChecklistRoom,
  ChecklistItemData,
} from '@/components/checklist/types';

// --- Types ---

interface DBCategory {
  id: string;
  name: string;
  sort_order: number;
  checklist_items: DBItem[];
}

interface DBItem {
  id: string;
  description: string;
  default_severity: string;
  requires_photo: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
}

export interface TemplateDetail {
  id: string;
  name: string;
  report_type: string;
  is_global: boolean;
  is_active: boolean;
}

// --- Mapper: DB rows → ChecklistRoom[] ---

export function mapToChecklistRooms(categories: DBCategory[]): ChecklistRoom[] {
  return categories.map((cat) => {
    const hasBathType = (cat.checklist_items ?? []).some(
      (i) => i.metadata?.bathType
    );

    const items: ChecklistItemData[] = (cat.checklist_items ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        id: item.id,
        text: item.description,
        hasChildren: item.metadata?.hasChildren as boolean | undefined,
        parentId: item.metadata?.parentId as string | undefined,
        bathType: item.metadata?.bathType as 'shower' | 'bath' | undefined,
        trade: item.metadata?.trade as string | undefined,
      }));

    return {
      id: cat.id,
      name: cat.name,
      hasBathType: hasBathType || undefined,
      items,
    };
  });
}

// --- Hook ---

export function useChecklistTemplate(templateId: string | null | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: checklistTemplateKeys.detail(templateId ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .select('*, checklist_categories(*, checklist_items(*))')
        .eq('id', templateId!)
        .order('sort_order', {
          referencedTable: 'checklist_categories',
        })
        .single();

      if (error) throw error;

      const categories = (
        (data.checklist_categories ?? []) as DBCategory[]
      ).sort((a, b) => a.sort_order - b.sort_order);

      return {
        template: {
          id: data.id as string,
          name: data.name as string,
          report_type: data.report_type as string,
          is_global: data.is_global as boolean,
          is_active: data.is_active as boolean,
        } as TemplateDetail,
        categories,
        rooms: mapToChecklistRooms(categories),
      };
    },
    enabled: !!templateId,
    staleTime: 5 * 60 * 1000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: checklistTemplateKeys.detail(templateId ?? ''),
    });
    // Also invalidate list to refresh category counts
    queryClient.invalidateQueries({
      queryKey: checklistTemplateKeys.all,
    });
  }, [queryClient, templateId]);

  // --- Category mutations ---

  const addCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const maxOrder =
        query.data?.categories.reduce(
          (max, c) => Math.max(max, c.sort_order),
          -1
        ) ?? -1;

      const { error } = await supabase.from('checklist_categories').insert({
        template_id: templateId!,
        name,
        sort_order: maxOrder + 1,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const removeCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('checklist_categories')
        .delete()
        .eq('id', categoryId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const renameCategoryMutation = useMutation({
    mutationFn: async ({
      categoryId,
      name,
    }: {
      categoryId: string;
      name: string;
    }) => {
      const { error } = await supabase
        .from('checklist_categories')
        .update({ name })
        .eq('id', categoryId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const batchReorderCategoriesMutation = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          supabase
            .from('checklist_categories')
            .update({ sort_order: index })
            .eq('id', id)
        )
      );
    },
    onSuccess: invalidate,
  });

  // --- Item mutations ---

  const addItemMutation = useMutation({
    mutationFn: async ({
      categoryId,
      description,
    }: {
      categoryId: string;
      description: string;
    }) => {
      const cat = query.data?.categories.find((c) => c.id === categoryId);
      const maxOrder =
        (cat?.checklist_items ?? []).reduce(
          (max, i) => Math.max(max, i.sort_order),
          -1
        ) ?? -1;

      const { error } = await supabase.from('checklist_items').insert({
        category_id: categoryId,
        description,
        sort_order: maxOrder + 1,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('checklist_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({
      itemId,
      description,
    }: {
      itemId: string;
      description: string;
    }) => {
      const { error } = await supabase
        .from('checklist_items')
        .update({ description })
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const batchReorderItemsMutation = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          supabase
            .from('checklist_items')
            .update({ sort_order: index })
            .eq('id', id)
        )
      );
    },
    onSuccess: invalidate,
  });

  const moveItemToCategoryMutation = useMutation({
    mutationFn: async ({
      itemId,
      targetCategoryId,
    }: {
      itemId: string;
      targetCategoryId: string;
    }) => {
      // Find max sort_order in target category
      const targetCat = query.data?.categories.find(
        (c) => c.id === targetCategoryId
      );
      const maxOrder =
        (targetCat?.checklist_items ?? []).reduce(
          (max, i) => Math.max(max, i.sort_order),
          -1
        ) ?? -1;

      const { error } = await supabase
        .from('checklist_items')
        .update({
          category_id: targetCategoryId,
          sort_order: maxOrder + 1,
        })
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // --- Convenience wrappers ---

  const addCategory = useCallback(
    (name: string) => addCategoryMutation.mutateAsync(name),
    [addCategoryMutation]
  );

  const removeCategory = useCallback(
    (categoryId: string) => removeCategoryMutation.mutateAsync(categoryId),
    [removeCategoryMutation]
  );

  const renameCategory = useCallback(
    (categoryId: string, name: string) =>
      renameCategoryMutation.mutateAsync({ categoryId, name }),
    [renameCategoryMutation]
  );

  const batchReorderCategories = useCallback(
    (orderedIds: string[]) =>
      batchReorderCategoriesMutation.mutateAsync(orderedIds),
    [batchReorderCategoriesMutation]
  );

  const addItem = useCallback(
    (categoryId: string, description: string) =>
      addItemMutation.mutateAsync({ categoryId, description }),
    [addItemMutation]
  );

  const removeItem = useCallback(
    (itemId: string) => removeItemMutation.mutateAsync(itemId),
    [removeItemMutation]
  );

  const updateItem = useCallback(
    (itemId: string, description: string) =>
      updateItemMutation.mutateAsync({ itemId, description }),
    [updateItemMutation]
  );

  const batchReorderItems = useCallback(
    (orderedIds: string[]) => batchReorderItemsMutation.mutateAsync(orderedIds),
    [batchReorderItemsMutation]
  );

  const moveItemToCategory = useCallback(
    (itemId: string, targetCategoryId: string) =>
      moveItemToCategoryMutation.mutateAsync({ itemId, targetCategoryId }),
    [moveItemToCategoryMutation]
  );

  return {
    template: query.data?.template ?? null,
    categories: query.data?.categories ?? [],
    rooms: query.data?.rooms ?? [],
    isLoading: query.isLoading,
    addCategory,
    removeCategory,
    renameCategory,
    batchReorderCategories,
    addItem,
    removeItem,
    updateItem,
    batchReorderItems,
    moveItemToCategory,
  };
}
