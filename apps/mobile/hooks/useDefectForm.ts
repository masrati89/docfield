import { useCallback, useEffect, useMemo, useState } from 'react';
import { ISRAELI_STANDARDS } from '@infield/shared';

// --- Types ---

export interface DefectFormInitialData {
  description?: string;
  category?: string;
  location?: string;
  recommendation?: string;
  standardRef?: string;
  severity?: string;
  costAmount?: string;
  costUnit?: string;
}

export interface UseDefectFormReturn {
  // Core form fields
  category: string;
  setCategory: (val: string) => void;
  categorySearch: string;
  setCategorySearch: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  severity: string;
  setSeverity: (val: string) => void;
  standardRef: string;
  setStandardRef: (val: string) => void;
  standardSection: string;
  standardDisplay: string;
  setStandardDisplay: (val: string) => void;
  recommendation: string;
  setRecommendation: (val: string) => void;
  note: string;
  setNote: (val: string) => void;

  // Cost fields
  costUnit: string;
  setCostUnit: (val: string) => void;
  costAmount: string;
  setCostAmount: (val: string) => void;
  costQty: string;
  setCostQty: (val: string) => void;
  costPerUnit: string;
  setCostPerUnit: (val: string) => void;
  defaultPrice: number | null;
  setDefaultPrice: (val: number | null) => void;

  // Entry source tracking
  entrySource: 'direct' | 'library';
  setEntrySource: (val: 'direct' | 'library') => void;

  // Derived & memos
  standardDescMap: Map<string, string>;
  standardOptions: string[];
  isDirty: boolean;
  canSave: boolean;

  // Handlers
  handleSelectStandard: (value: string) => void;
}

interface FormState {
  description: string;
  category: string;
  categorySearch: string;
  location: string;
  severity: string;
  standardRef: string;
  standardSection: string;
  standardDisplay: string;
  recommendation: string;
  note: string;
  costUnit: string;
  costAmount: string;
  costQty: string;
  costPerUnit: string;
  defaultPrice: number | null;
  entrySource: 'direct' | 'library';
}

// --- Hook ---

export function useDefectForm(
  initialCategory?: string,
  initialData?: DefectFormInitialData,
  isLoadingTemplate?: boolean
): UseDefectFormReturn {
  // Single state object for all form fields — ensures batching of template initializations
  const [formState, setFormState] = useState<FormState>({
    description: '',
    category: initialCategory ?? '',
    categorySearch: '',
    location: '',
    severity: 'medium',
    standardRef: '',
    standardSection: '',
    standardDisplay: '',
    recommendation: '',
    note: '',
    costUnit: 'fixed',
    costAmount: '',
    costQty: '',
    costPerUnit: '',
    defaultPrice: null,
    entrySource: 'direct',
  });

  // Individual setter functions that update the single state object
  const setDescription = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, description: val })),
    []
  );
  const setCategory = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, category: val })),
    []
  );
  const setCategorySearch = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, categorySearch: val })),
    []
  );
  const setLocation = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, location: val })),
    []
  );
  const setSeverity = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, severity: val })),
    []
  );
  const setStandardRef = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, standardRef: val })),
    []
  );
  const setStandardDisplay = useCallback(
    (val: string) =>
      setFormState((prev) => ({ ...prev, standardDisplay: val })),
    []
  );
  const setRecommendation = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, recommendation: val })),
    []
  );
  const setNote = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, note: val })),
    []
  );
  const setCostUnit = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, costUnit: val })),
    []
  );
  const setCostAmount = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, costAmount: val })),
    []
  );
  const setCostQty = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, costQty: val })),
    []
  );
  const setCostPerUnit = useCallback(
    (val: string) => setFormState((prev) => ({ ...prev, costPerUnit: val })),
    []
  );
  const setDefaultPrice = useCallback(
    (val: number | null) =>
      setFormState((prev) => ({ ...prev, defaultPrice: val })),
    []
  );
  const setEntrySource = useCallback(
    (val: 'direct' | 'library') =>
      setFormState((prev) => ({ ...prev, entrySource: val })),
    []
  );

  // Apply template initialData once when it becomes available
  // All fields update in a single state operation, ensuring batching
  // and robustness against future async changes.
  useEffect(() => {
    if (!isLoadingTemplate && initialData) {
      setFormState((prev) => ({
        ...prev,
        description: initialData.description ?? prev.description,
        category: initialData.category ?? prev.category,
        location: initialData.location ?? prev.location,
        recommendation: initialData.recommendation ?? prev.recommendation,
        standardRef: initialData.standardRef ?? prev.standardRef,
        severity: initialData.severity ?? prev.severity,
        costAmount: initialData.costAmount ?? prev.costAmount,
        costUnit: initialData.costUnit ?? prev.costUnit,
      }));
    }
  }, [isLoadingTemplate, initialData]);

  // Build a lookup map for standard descriptions
  const standardDescMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const std of ISRAELI_STANDARDS) {
      for (const sec of std.sections) {
        const key = `${std.name} סעיף ${sec.code} — ${sec.title}`;
        map.set(key, sec.desc);
      }
    }
    return map;
  }, []);

  // Build flattened standard options for ComboField
  const standardOptions = useMemo(() => {
    return ISRAELI_STANDARDS.flatMap((std) =>
      std.sections.map((sec) => `${std.name} סעיף ${sec.code} — ${sec.title}`)
    );
  }, []);

  // Dirty check — exclude initialCategory since it's pre-filled
  const isDirty =
    (!!formState.category && formState.category !== (initialCategory ?? '')) ||
    !!formState.description.trim() ||
    !!formState.location ||
    !!formState.standardRef.trim() ||
    !!formState.recommendation.trim() ||
    !!formState.costAmount ||
    !!formState.costQty ||
    !!formState.costPerUnit ||
    !!formState.note.trim();

  // Can save if category + description are populated
  const canSave =
    !!formState.category && formState.description.trim().length > 0;

  // Handle standard selection
  const handleSelectStandard = useCallback(
    (value: string) => {
      setStandardRef(value);
      setStandardDisplay(standardDescMap.get(value) ?? '');
    },
    [standardDescMap, setStandardRef, setStandardDisplay]
  );

  return {
    category: formState.category,
    setCategory,
    categorySearch: formState.categorySearch,
    setCategorySearch,
    description: formState.description,
    setDescription,
    location: formState.location,
    setLocation,
    severity: formState.severity,
    setSeverity,
    standardRef: formState.standardRef,
    setStandardRef,
    standardSection: formState.standardSection,
    standardDisplay: formState.standardDisplay,
    setStandardDisplay,
    recommendation: formState.recommendation,
    setRecommendation,
    note: formState.note,
    setNote,
    costUnit: formState.costUnit,
    setCostUnit,
    costAmount: formState.costAmount,
    setCostAmount,
    costQty: formState.costQty,
    setCostQty,
    costPerUnit: formState.costPerUnit,
    setCostPerUnit,
    defaultPrice: formState.defaultPrice,
    setDefaultPrice,
    entrySource: formState.entrySource,
    setEntrySource,
    standardDescMap,
    standardOptions,
    isDirty,
    canSave,
    handleSelectStandard,
  };
}
