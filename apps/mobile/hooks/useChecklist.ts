import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

import { supabase } from '@/lib/supabase';
import { CHECKLIST_ROOMS } from '@/components/checklist/constants';
import type {
  ChecklistStatus,
  StatusMap,
  DefectTextMap,
  BathTypeMap,
  OpenMap,
} from '@/components/checklist/types';

// Shape stored in delivery_reports.checklist_state
interface ChecklistState {
  statuses?: StatusMap;
  defectTexts?: DefectTextMap;
  bathTypes?: BathTypeMap;
}

export function useChecklist(
  reportId: string | undefined,
  onSaveError?: (msg: string) => void
) {
  const [openRooms, setOpenRooms] = useState<OpenMap>({ entrance: true });
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [defectTexts, setDefectTexts] = useState<DefectTextMap>({});
  const [bathTypes, setBathTypes] = useState<BathTypeMap>({
    bath_master: 'shower',
  });
  const [activeDefect, setActiveDefect] = useState<string | null>(null);
  const [isLoadingState, setIsLoadingState] = useState(true);

  // Track current values in refs so the persist callback always has fresh data
  // without needing them as dependencies (avoids stale closure loops).
  const statusesRef = useRef(statuses);
  const defectTextsRef = useRef(defectTexts);
  const bathTypesRef = useRef(bathTypes);
  statusesRef.current = statuses;
  defectTextsRef.current = defectTexts;
  bathTypesRef.current = bathTypes;

  // --- Load persisted state on mount ---
  useEffect(() => {
    if (!reportId) {
      setIsLoadingState(false);
      return;
    }

    let cancelled = false;

    async function loadState() {
      setIsLoadingState(true);
      try {
        const { data, error } = await supabase
          .from('delivery_reports')
          .select('checklist_state')
          .eq('id', reportId)
          .single();

        if (cancelled) return;

        if (error) {
          // Non-fatal — start with empty state
          console.warn(
            '[useChecklist] Failed to load checklist_state:',
            error.message
          );
          return;
        }

        const saved = data?.checklist_state as ChecklistState | null;
        if (saved) {
          if (saved.statuses && Object.keys(saved.statuses).length > 0) {
            setStatuses(saved.statuses);
          }
          if (saved.defectTexts && Object.keys(saved.defectTexts).length > 0) {
            setDefectTexts(saved.defectTexts);
          }
          if (saved.bathTypes && Object.keys(saved.bathTypes).length > 0) {
            setBathTypes((prev) => ({ ...prev, ...saved.bathTypes }));
          }
        }
      } catch {
        // Non-fatal
      } finally {
        if (!cancelled) setIsLoadingState(false);
      }
    }

    loadState();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  // --- Persist state to Supabase (fire-and-forget, optimistic) ---
  const persistState = useCallback(
    async (
      nextStatuses: StatusMap,
      nextDefectTexts: DefectTextMap,
      nextBathTypes: BathTypeMap
    ) => {
      if (!reportId) return;

      const payload: ChecklistState = {
        statuses: nextStatuses,
        defectTexts: nextDefectTexts,
        bathTypes: nextBathTypes,
      };

      const { error } = await supabase
        .from('delivery_reports')
        .update({ checklist_state: payload })
        .eq('id', reportId);

      if (error) {
        console.error('[useChecklist] Failed to persist state:', error.message);
        onSaveError?.('לא הצלחנו לשמור — נסה שוב');
      }
    },
    [reportId, onSaveError]
  );

  // --- Toggle room (accordion — one open at a time) ---
  const toggleRoom = useCallback((roomId: string) => {
    setOpenRooms((prev) => {
      const newMap: OpenMap = {};
      Object.keys(prev).forEach((k) => (newMap[k] = false));
      newMap[roomId] = !prev[roomId];
      return newMap;
    });
  }, []);

  // --- Set item status (optimistic + persist) ---
  const setItemStatus = useCallback(
    (itemId: string, status: ChecklistStatus) => {
      setStatuses((prev) => {
        const next = { ...prev, [itemId]: status };
        statusesRef.current = next;

        let nextDefectTexts = defectTextsRef.current;
        if (status !== 'defect' && status !== 'partial') {
          nextDefectTexts = { ...defectTextsRef.current };
          delete nextDefectTexts[itemId];
          defectTextsRef.current = nextDefectTexts;
          setDefectTexts(nextDefectTexts);
        }

        // Fire-and-forget persist
        persistState(next, nextDefectTexts, bathTypesRef.current);
        return next;
      });
    },
    [persistState]
  );

  // --- Set defect text (optimistic + persist) ---
  const setDefectText = useCallback(
    (itemId: string, text: string) => {
      setDefectTexts((prev) => {
        const next = { ...prev, [itemId]: text };
        defectTextsRef.current = next;
        persistState(statusesRef.current, next, bathTypesRef.current);
        return next;
      });
    },
    [persistState]
  );

  // --- Set bath type (optimistic + persist) ---
  const setBathType = useCallback(
    (roomId: string, value: 'shower' | 'bath') => {
      setBathTypes((prev) => {
        const next = { ...prev, [roomId]: value };
        bathTypesRef.current = next;
        persistState(statusesRef.current, defectTextsRef.current, next);
        return next;
      });
    },
    [persistState]
  );

  // --- Computed stats ---
  const stats = useMemo(() => {
    const allVisible = CHECKLIST_ROOMS.flatMap((r) =>
      r.items.filter((i) => {
        if (i.bathType && i.bathType !== (bathTypes[r.id] || 'shower'))
          return false;
        if (i.parentId && statuses[i.parentId] !== 'ok') return false;
        return true;
      })
    );
    const checked = allVisible.filter((i) => statuses[i.id]).length;
    const total = allVisible.length;
    const defectCount = allVisible.filter(
      (i) => statuses[i.id] === 'defect' || statuses[i.id] === 'partial'
    ).length;
    return { checked, total, defectCount };
  }, [statuses, bathTypes]);

  return {
    openRooms,
    statuses,
    defectTexts,
    bathTypes,
    activeDefect,
    stats,
    isLoadingState,
    toggleRoom,
    setItemStatus,
    setDefectText,
    setBathType,
    setActiveDefect,
  };
}
