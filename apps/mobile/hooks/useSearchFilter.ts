import { useMemo } from 'react';
import { CATEGORY_LABELS } from '@infield/shared';
import type { DefectLibraryItem } from './useDefectLibrary';

// --- Types ---

export interface GroupedResults {
  category: string;
  categoryLabel: string;
  items: DefectLibraryItem[];
}

// --- Hook ---

export function useSearchFilter(
  libraryItems: DefectLibraryItem[],
  selectionOrder: string[],
  queryDebounced: string
) {
  // Filter by categories (OR semantics) and text (AND semantics)
  const filtered = useMemo(() => {
    let items = libraryItems;

    // Filter by categories: if any selected, include only items in selected categories
    if (selectionOrder.length > 0) {
      const selectedSet = new Set(selectionOrder);
      items = items.filter((item) => selectedSet.has(item.category));
    }

    // Filter by search text (AND semantics with categories)
    if (queryDebounced.trim()) {
      const q = queryDebounced.trim().toLowerCase();
      items = items.filter((item) => item.title.toLowerCase().includes(q));
    }

    return items;
  }, [libraryItems, selectionOrder, queryDebounced]);

  // Group results by category in selection order (for 2+ chips)
  const grouped = useMemo(() => {
    if (selectionOrder.length < 2) return null;

    const groups: GroupedResults[] = [];

    selectionOrder.forEach((categoryValue) => {
      const categoryItems = filtered.filter(
        (item) => item.category === categoryValue
      );

      // Only show groups with results after filtering
      if (categoryItems.length > 0) {
        // Sort by usage_count (desc), then alphabetically by title
        categoryItems.sort(
          (a, b) =>
            (b.usage_count || 0) - (a.usage_count || 0) ||
            a.title.localeCompare(b.title)
        );

        const categoryLabel =
          CATEGORY_LABELS[categoryValue as keyof typeof CATEGORY_LABELS] ||
          categoryValue;

        groups.push({
          category: categoryValue,
          categoryLabel,
          items: categoryItems,
        });
      }
    });

    return groups;
  }, [filtered, selectionOrder]);

  // Flat sorted list (for 0-1 chips)
  const flatSorted = useMemo(() => {
    if (selectionOrder.length >= 2) return [];

    return [...filtered].sort(
      (a, b) =>
        (b.usage_count || 0) - (a.usage_count || 0) ||
        a.title.localeCompare(b.title)
    );
  }, [filtered, selectionOrder]);

  return { filtered, grouped, flatSorted };
}
