import { useCallback, useMemo, useState } from 'react';
import { ISRAELI_STANDARDS } from '@infield/shared';

// --- Types ---

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

// --- Hook ---

export function useDefectForm(initialCategory?: string): UseDefectFormReturn {
  // Core form state
  const [category, setCategory] = useState(initialCategory ?? '');
  const [categorySearch, setCategorySearch] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<string>('medium');
  const [standardRef, setStandardRef] = useState('');
  const [standardSection, _setStandardSection] = useState('');
  const [standardDisplay, setStandardDisplay] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [note, setNote] = useState('');

  // Cost state
  const [costUnit, setCostUnit] = useState('fixed');
  const [costAmount, setCostAmount] = useState('');
  const [costQty, setCostQty] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [defaultPrice, setDefaultPrice] = useState<number | null>(null);

  // Entry source
  const [entrySource, setEntrySource] = useState<'direct' | 'library'>(
    'direct'
  );

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
    (!!category && category !== (initialCategory ?? '')) ||
    !!description.trim() ||
    !!location ||
    !!standardRef.trim() ||
    !!recommendation.trim() ||
    !!costAmount ||
    !!costQty ||
    !!costPerUnit ||
    !!note.trim();

  // Can save if category + description are populated
  const canSave = !!category && description.trim().length > 0;

  // Handle standard selection
  const handleSelectStandard = useCallback(
    (value: string) => {
      setStandardRef(value);
      setStandardDisplay(standardDescMap.get(value) ?? '');
    },
    [standardDescMap]
  );

  return {
    category,
    setCategory,
    categorySearch,
    setCategorySearch,
    description,
    setDescription,
    location,
    setLocation,
    severity,
    setSeverity,
    standardRef,
    setStandardRef,
    standardSection,
    standardDisplay,
    setStandardDisplay,
    recommendation,
    setRecommendation,
    note,
    setNote,
    costUnit,
    setCostUnit,
    costAmount,
    setCostAmount,
    costQty,
    setCostQty,
    costPerUnit,
    setCostPerUnit,
    defaultPrice,
    setDefaultPrice,
    entrySource,
    setEntrySource,
    standardDescMap,
    standardOptions,
    isDirty,
    canSave,
    handleSelectStandard,
  };
}
