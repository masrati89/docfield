import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Fuse from 'fuse.js';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// --- Types ---

export interface DefectLibraryItem {
  id: string;
  title: string;
  category: string;
  location: string;
  standardRef: string | null;
  recommendation: string | null;
  cost: number | null;
  costUnit: string | null;
  notes: string | null;
  source: 'system' | 'user';
  userId: string | null;
}

interface SimilarityMatch {
  item: DefectLibraryItem;
  matchType: 'exact_title' | 'keywords';
}

// --- Query Key ---

export const defectLibraryKeys = {
  all: ['defect-library'] as const,
  list: () => [...defectLibraryKeys.all, 'list'] as const,
};

// --- Fetcher ---

async function fetchDefectLibrary(
  userId: string
): Promise<DefectLibraryItem[]> {
  const { data, error } = await supabase
    .from('defect_library')
    .select(
      'id, title, category, location, standard_ref, recommendation, cost, cost_unit, notes, source, user_id'
    )
    .or(`source.eq.system,user_id.eq.${userId}`)
    .order('source')
    .order('title');

  if (error) throw error;

  return (data ?? []).map((d: Record<string, unknown>) => ({
    id: d.id as string,
    title: d.title as string,
    category: (d.category as string) ?? '',
    location: (d.location as string) ?? '',
    standardRef: d.standard_ref as string | null,
    recommendation: d.recommendation as string | null,
    cost: d.cost as number | null,
    costUnit: d.cost_unit as string | null,
    notes: d.notes as string | null,
    source: d.source as 'system' | 'user',
    userId: d.user_id as string | null,
  }));
}

// --- Hook ---

export function useDefectLibrary() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const query = useQuery({
    queryKey: defectLibraryKeys.list(),
    queryFn: () => fetchDefectLibrary(userId),
    enabled: !!userId,
  });

  const items = useMemo(() => query.data ?? [], [query.data]);

  // Fuse.js search
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ['title', 'category', 'location'],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [items]
  );

  // Filtered + searched items
  const filteredItems = useMemo(() => {
    let result = items;

    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map((r) => r.item);
    }

    if (categoryFilter) {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Sort: user items first, then system
    return result.sort((a, b) => {
      if (a.source === 'user' && b.source === 'system') return -1;
      if (a.source === 'system' && b.source === 'user') return 1;
      return 0;
    });
  }, [items, searchQuery, categoryFilter, fuse]);

  // Categories
  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [items]);

  // Delete user item
  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('defect_library')
        .delete()
        .eq('id', itemId)
        .eq('source', 'user')
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: defectLibraryKeys.list() });
    },
  });

  // Add to library
  const addMutation = useMutation({
    mutationFn: async (
      item: Omit<DefectLibraryItem, 'id' | 'source' | 'userId'>
    ) => {
      // Get organization_id from user profile (required by RLS)
      const { data: userData } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', userId)
        .single();

      if (!userData?.organization_id) throw new Error('לא נמצא ארגון למשתמש');

      const { error } = await supabase.from('defect_library').insert({
        title: item.title,
        category: item.category,
        location: item.location,
        standard_ref: item.standardRef,
        recommendation: item.recommendation,
        cost: item.cost,
        cost_unit: item.costUnit,
        notes: item.notes,
        source: 'user',
        user_id: userId,
        organization_id: userData.organization_id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: defectLibraryKeys.list() });
    },
  });

  // Update user item
  const updateMutation = useMutation({
    mutationFn: async ({
      itemId,
      updates,
    }: {
      itemId: string;
      updates: Partial<Omit<DefectLibraryItem, 'id' | 'source' | 'userId'>>;
    }) => {
      const updateData: Record<string, unknown> = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.category !== undefined)
        updateData.category = updates.category;
      if (updates.location !== undefined)
        updateData.location = updates.location;
      if (updates.standardRef !== undefined)
        updateData.standard_ref = updates.standardRef;
      if (updates.recommendation !== undefined)
        updateData.recommendation = updates.recommendation;
      if (updates.cost !== undefined) updateData.cost = updates.cost;
      if (updates.costUnit !== undefined)
        updateData.cost_unit = updates.costUnit;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { error } = await supabase
        .from('defect_library')
        .update(updateData)
        .eq('id', itemId)
        .eq('source', 'user');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: defectLibraryKeys.list() });
    },
  });

  // Similarity detection
  const findSimilar = useCallback(
    (title: string): SimilarityMatch | null => {
      if (!title.trim()) return null;

      // Exact title match
      const exactMatch = items.find((i) => i.title.trim() === title.trim());
      if (exactMatch) {
        return { item: exactMatch, matchType: 'exact_title' };
      }

      // 3+ shared Hebrew keywords (words longer than 2 chars)
      const titleWords = title.split(/\s+/).filter((w) => w.length > 2);

      if (titleWords.length < 3) return null;

      for (const item of items) {
        const itemWords = item.title.split(/\s+/).filter((w) => w.length > 2);
        const shared = titleWords.filter((w) => itemWords.includes(w));
        if (shared.length >= 3) {
          return { item, matchType: 'keywords' };
        }
      }

      return null;
    },
    [items]
  );

  return {
    items: filteredItems,
    allItems: items,
    categories,
    isLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.isError,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    deleteItem: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    addItem: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateItem: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    findSimilar,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: defectLibraryKeys.list() }),
  };
}
