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
  price: number | null;
  source: 'system' | 'user';
  userId: string | null;
  usage_count?: number;
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
// DB schema (migration 008): id, organization_id, description, category,
// default_severity, standard_reference, is_global, created_at

async function fetchDefectLibrary(
  _userId: string
): Promise<DefectLibraryItem[]> {
  const { data, error } = await supabase
    .from('defect_library')
    .select(
      'id, title, description, category, standard_reference, recommendation, price, is_global, organization_id, usage_count'
    )
    .order('category')
    .order('description');

  if (error) throw error;

  return (data ?? []).map((d: Record<string, unknown>) => ({
    id: d.id as string,
    title: ((d.title as string) || (d.description as string)) ?? '',
    category: (d.category as string) ?? '',
    location: '',
    standardRef: (d.standard_reference as string) ?? null,
    recommendation: (d.recommendation as string) ?? null,
    cost: null,
    costUnit: null,
    notes: null,
    price: (d.price as number) ?? null,
    source: (d.is_global as boolean) ? ('system' as const) : ('user' as const),
    userId: null,
    usage_count: (d.usage_count as number) ?? 0,
  }));
}

// --- Hook ---

type GroupingMode = 'none' | 'room' | 'category' | 'relevance';

interface UseDefectLibraryReturn {
  items: DefectLibraryItem[];
  allItems: DefectLibraryItem[];
  categories: string[];
  standards: string[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string[];
  setCategoryFilter: (cats: string[]) => void;
  selectedStandard: string | undefined;
  setSelectedStandard: (standard: string | undefined) => void;
  groupingMode: GroupingMode;
  deleteItem: (id: string) => void;
  isDeleting: boolean;
  addItem: (
    item: Omit<DefectLibraryItem, 'id' | 'source' | 'userId'>
  ) => Promise<void>;
  isAdding: boolean;
  updateItem: (
    itemId: string,
    updates: Partial<Omit<DefectLibraryItem, 'id' | 'source' | 'userId'>>
  ) => Promise<void>;
  isUpdating: boolean;
  findSimilar: (title: string) => SimilarityMatch | null;
  refetch: () => void;
}

export function useDefectLibrary(): UseDefectLibraryReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<
    string | undefined
  >();

  const query = useQuery({
    queryKey: defectLibraryKeys.list(),
    queryFn: () => fetchDefectLibrary(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const items = useMemo(() => query.data ?? [], [query.data]);

  // Fuse.js search
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ['title', 'category'],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [items]
  );

  // Filtering logic: text → categories → standard
  const filteredItems = useMemo(() => {
    let result = items;

    // Step 1: Text search (Fuse.js)
    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map((r) => r.item);
    }

    // Step 2: Category filter (OR logic - if multiple selected, include all)
    if (categoryFilter.length > 0) {
      result = result.filter((item) => categoryFilter.includes(item.category));
    }

    // Step 3: Standard filter (optional - only if explicitly selected)
    if (selectedStandard) {
      result = result.filter((item) => item.standardRef === selectedStandard);
    }

    // Sort: user items first, then system
    return result.sort((a, b) => {
      if (a.source === 'user' && b.source === 'system') return -1;
      if (a.source === 'system' && b.source === 'user') return 1;
      return 0;
    });
  }, [items, searchQuery, categoryFilter, selectedStandard, fuse]);

  // Determine grouping mode intelligently
  const groupingMode = useMemo<GroupingMode>(() => {
    if (categoryFilter.length === 1 && !selectedStandard) return 'room';
    if (selectedStandard) return 'category';
    if (searchQuery.trim()) return 'relevance';
    return 'none';
  }, [categoryFilter, selectedStandard, searchQuery]);

  // Categories
  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [items]);

  // Standards (286 unique values from DB)
  const standards = useMemo(() => {
    const stds = new Set(
      items.map((i) => i.standardRef).filter((s): s is string => s !== null)
    );
    return Array.from(stds).sort();
  }, [items]);

  // Delete user item
  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('defect_library')
        .delete()
        .eq('id', itemId)
        .eq('is_global', false);

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
        description: item.title,
        category: item.category,
        standard_reference: item.standardRef,
        is_global: false,
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
      if (updates.title !== undefined) updateData.description = updates.title;
      if (updates.category !== undefined)
        updateData.category = updates.category;
      if (updates.standardRef !== undefined)
        updateData.standard_reference = updates.standardRef;

      const { error } = await supabase
        .from('defect_library')
        .update(updateData)
        .eq('id', itemId)
        .eq('is_global', false);

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

  const updateItemAsync = useCallback(
    async (
      itemId: string,
      updates: Partial<Omit<DefectLibraryItem, 'id' | 'source' | 'userId'>>
    ) => {
      return updateMutation.mutateAsync({ itemId, updates });
    },
    [updateMutation]
  );

  return {
    items: filteredItems,
    allItems: items,
    categories,
    standards,
    isLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.isError,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    selectedStandard,
    setSelectedStandard,
    groupingMode,
    deleteItem: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    addItem: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateItem: updateItemAsync,
    isUpdating: updateMutation.isPending,
    findSimilar,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: defectLibraryKeys.list() }),
  };
}
