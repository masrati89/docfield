import { useCallback, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import * as Haptics from '@/lib/haptics';
import type { DefectLibraryItem } from '@/hooks/useDefectLibrary';

// --- Types ---

export interface UseDefectLibrarySuggestionsInput {
  // Form state from useDefectForm
  description: string;
  category: string;
  location: string;
  standardRef: string;
  recommendation: string;
  costAmount: string;
  costUnit: string;
  note: string;
  defaultPrice: number | null;
  standardDescMap: Map<string, string>;

  // Form setters from useDefectForm
  setDescription: (val: string) => void;
  setCategory: (val: string) => void;
  setLocation: (val: string) => void;
  setStandardRef: (val: string) => void;
  setStandardDisplay: (val: string) => void;
  setRecommendation: (val: string) => void;
  setDefaultPrice: (val: number | null) => void;
  setCostAmount: (val: string) => void;
  setEntrySource: (val: 'direct' | 'library') => void;

  // Library data from useDefectLibrary
  libraryItems: DefectLibraryItem[];
  addItem: (item: unknown) => Promise<void>;
  isAdding: boolean;

  // Toast
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export interface UseDefectLibrarySuggestionsReturn {
  showSuggestions: boolean;
  setShowSuggestions: (val: boolean) => void;
  addedToLibrary: boolean;
  suggestions: DefectLibraryItem[];
  showAddToLibrary: boolean;
  handleSelectSuggestion: (item: DefectLibraryItem) => void;
  handleAddToLibrary: () => Promise<void>;
}

// --- Hook ---

export function useDefectLibrarySuggestions(
  input: UseDefectLibrarySuggestionsInput
): UseDefectLibrarySuggestionsReturn {
  const {
    description,
    category,
    location,
    standardRef,
    recommendation,
    costAmount,
    costUnit,
    note,
    defaultPrice,
    standardDescMap,
    setDescription,
    setCategory,
    setLocation,
    setStandardRef,
    setStandardDisplay,
    setRecommendation,
    setDefaultPrice,
    setCostAmount,
    setEntrySource,
    libraryItems,
    addItem,
    isAdding,
    showToast,
  } = input;

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addedToLibrary, setAddedToLibrary] = useState(false);

  // Filter library items by category and description text
  const suggestions = useMemo(() => {
    let pool = libraryItems;
    if (category) {
      pool = pool.filter((item) => item.category === category);
    }

    if (!description.trim()) {
      return pool.slice(0, 10);
    }

    const query = description.trim().toLowerCase();
    return pool
      .filter((item) => item.title.toLowerCase().includes(query))
      .slice(0, 10);
  }, [description, libraryItems, category]);

  // Show "Add to Library" when description has text and no exact match
  const showAddToLibrary = useMemo(() => {
    if (!description.trim() || description.trim().length < 2) return false;
    const query = description.trim().toLowerCase();
    return !libraryItems.some((item) => item.title.toLowerCase() === query);
  }, [description, libraryItems]);

  // Apply suggestion to form fields
  const handleSelectSuggestion = useCallback(
    (item: DefectLibraryItem) => {
      setDescription(item.title);
      if (item.category && !category) setCategory(item.category);
      if (item.location && !location) setLocation(item.location);
      if (item.standardRef && !standardRef) {
        setStandardRef(item.standardRef);
        setStandardDisplay(standardDescMap.get(item.standardRef) ?? '');
      }
      if (item.recommendation && !recommendation)
        setRecommendation(item.recommendation);
      if (item.price && !defaultPrice) {
        setDefaultPrice(item.price);
        setCostAmount(item.price.toString());
      }
      setShowSuggestions(false);
      setEntrySource('library');
    },
    [
      category,
      location,
      standardRef,
      recommendation,
      defaultPrice,
      standardDescMap,
      setDescription,
      setCategory,
      setLocation,
      setStandardRef,
      setStandardDisplay,
      setRecommendation,
      setDefaultPrice,
      setCostAmount,
      setEntrySource,
    ]
  );

  // Add current form data to library
  const handleAddToLibrary = useCallback(async () => {
    if (!description.trim() || isAdding) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      await addItem({
        title: description.trim(),
        category: category || '',
        location: location || '',
        standardRef: standardRef.trim() || null,
        recommendation: recommendation.trim() || null,
        cost: costAmount ? parseFloat(costAmount) : null,
        costUnit: costUnit || null,
        notes: note.trim() || null,
        price: defaultPrice || (costAmount ? parseFloat(costAmount) : null),
      });
      setAddedToLibrary(true);
      showToast('נוסף למאגר בהצלחה', 'success');
      setTimeout(() => setAddedToLibrary(false), 2000);
    } catch {
      showToast('שגיאה בהוספה למאגר', 'error');
    }
  }, [
    description,
    category,
    location,
    standardRef,
    recommendation,
    costAmount,
    costUnit,
    note,
    defaultPrice,
    isAdding,
    addItem,
    showToast,
  ]);

  return {
    showSuggestions,
    setShowSuggestions,
    addedToLibrary,
    suggestions,
    showAddToLibrary,
    handleSelectSuggestion,
    handleAddToLibrary,
  };
}
