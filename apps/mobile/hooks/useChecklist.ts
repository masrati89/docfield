import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { CHECKLIST_ROOMS } from '@/components/checklist/constants';
import { mapToChecklistRooms } from '@/hooks/useChecklistTemplate';
import type {
  ChecklistItemData,
  ChecklistRoom,
  ChecklistStatus,
  StatusMap,
  DefectTextMap,
  BathTypeMap,
  OpenMap,
} from '@/components/checklist/types';

export type ChecklistViewMode = 'rooms' | 'trades';

// Hebrew labels for each trade key
const TRADE_LABELS: Record<string, string> = {
  electrical: 'חשמל',
  plumbing: 'אינסטלציה',
  tiling: 'ריצוף וחיפוי',
  painting: 'צבע וטיח',
  aluminum: 'אלומיניום',
  hvac: 'מיזוג ואוורור',
  doors: 'דלתות',
  kitchen: 'מטבח',
  gas: 'גז',
  steel_frames: 'מסגרות',
  other: 'אחר',
};

// Shape stored in delivery_reports.checklist_state
interface ChecklistState {
  statuses?: StatusMap;
  defectTexts?: DefectTextMap;
  bathTypes?: BathTypeMap;
  viewMode?: ChecklistViewMode;
}

export function useChecklist(
  reportId: string | undefined,
  templateId?: string | null,
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
  const [viewMode, setViewMode] = useState<ChecklistViewMode>('rooms');

  // Track current values in refs so the persist callback always has fresh data
  // without needing them as dependencies (avoids stale closure loops).
  const statusesRef = useRef(statuses);
  const defectTextsRef = useRef(defectTexts);
  const bathTypesRef = useRef(bathTypes);
  statusesRef.current = statuses;
  defectTextsRef.current = defectTexts;
  bathTypesRef.current = bathTypes;

  // --- Fetch template rooms from DB (when templateId is provided) ---
  const { data: templateRooms } = useQuery({
    queryKey: ['checklist-template-rooms', templateId],
    queryFn: async (): Promise<ChecklistRoom[]> => {
      const { data, error } = await supabase
        .from('checklist_categories')
        .select('*, checklist_items(*)')
        .eq('template_id', templateId!)
        .order('sort_order');

      if (error) throw error;

      return mapToChecklistRooms(
        (data ?? []) as {
          id: string;
          name: string;
          sort_order: number;
          checklist_items: {
            id: string;
            description: string;
            default_severity: string;
            requires_photo: boolean;
            sort_order: number;
            metadata: Record<string, unknown>;
          }[];
        }[]
      );
    },
    enabled: !!templateId,
    staleTime: Infinity,
  });

  // Use template rooms if available, otherwise fall back to hardcoded constant
  const rooms: ChecklistRoom[] = templateRooms ?? CHECKLIST_ROOMS;

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
          if (saved.viewMode) {
            setViewMode(saved.viewMode);
          }
        }
      } catch {
        // Non-fatal
      } finally {
        // Always clear loading — even if cancelled (component remounted).
        // Prevents isLoadingState from getting stuck on true during fast-refresh
        // or useFocusEffect remount cycles, which hides all checklist UI.
        setIsLoadingState(false);
      }
    }

    loadState();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  // Track viewMode in ref for persist callback
  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;

  // Track report status to prevent updates to completed reports (C3/H5)
  const [reportStatus, setReportStatus] = useState<string>('draft');
  useEffect(() => {
    if (!reportId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('delivery_reports')
        .select('status')
        .eq('id', reportId)
        .single();
      if (!cancelled && !error && data) {
        setReportStatus((data.status as string) ?? 'draft');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  // Debounce timer ref for persist (H5)
  const persistTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Persist state to Supabase (debounced 400ms, fire-and-forget) ---
  const persistState = useCallback(
    (
      nextStatuses: StatusMap,
      nextDefectTexts: DefectTextMap,
      nextBathTypes: BathTypeMap
    ) => {
      if (!reportId || reportStatus === 'completed') return; // C3: skip if completed

      // Clear pending debounce
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }

      // Schedule new persist in 400ms (H5: debounce)
      persistTimeoutRef.current = setTimeout(() => {
        (async () => {
          const payload: ChecklistState = {
            statuses: nextStatuses,
            defectTexts: nextDefectTexts,
            bathTypes: nextBathTypes,
            viewMode: viewModeRef.current,
          };

          const { error } = await supabase
            .from('delivery_reports')
            .update({ checklist_state: payload })
            .eq('id', reportId);

          if (error) {
            console.error(
              '[useChecklist] Failed to persist state:',
              error.message
            );
            onSaveError?.('לא הצלחנו לשמור — נסה שוב');
          }
        })();
      }, 400);
    },
    [reportId, reportStatus, onSaveError]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }
    };
  }, []);

  // --- Toggle room (accordion — one open at a time) ---
  const toggleRoom = useCallback((roomId: string) => {
    setOpenRooms((prev) => {
      const newMap: OpenMap = {};
      Object.keys(prev).forEach((k) => (newMap[k] = false));
      newMap[roomId] = !prev[roomId];
      return newMap;
    });
  }, []);

  // --- Set item status (optimistic + debounced persist) ---
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

        persistState(next, nextDefectTexts, bathTypesRef.current);
        return next;
      });
    },
    [persistState]
  );

  // --- Set defect text (optimistic + debounced persist) ---
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

  // --- Set bath type (optimistic + debounced persist) ---
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

  // --- Group by trade ---
  const tradeRooms: ChecklistRoom[] = useMemo(() => {
    const allItems = rooms.flatMap((r) => r.items);
    const grouped: Record<string, ChecklistItemData[]> = {};

    for (const item of allItems) {
      const key = item.trade ?? 'other';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }

    // Deterministic order: match TRADE_LABELS key order
    const tradeOrder = Object.keys(TRADE_LABELS);
    return tradeOrder
      .filter((key) => grouped[key] && grouped[key].length > 0)
      .map((key) => ({
        id: `trade_${key}`,
        name: TRADE_LABELS[key] ?? key,
        items: grouped[key],
      }));
  }, [rooms]);

  // Active rooms based on viewMode
  const activeRooms = viewMode === 'trades' ? tradeRooms : rooms;

  // --- Handle view mode change (persist) ---
  const handleSetViewMode = useCallback(
    (mode: ChecklistViewMode) => {
      setViewMode(mode);
      viewModeRef.current = mode;
      // Persist with current state
      persistState(
        statusesRef.current,
        defectTextsRef.current,
        bathTypesRef.current
      );
    },
    [persistState]
  );

  // --- Computed stats ---
  const stats = useMemo(() => {
    const allVisible = rooms.flatMap((r) =>
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
  }, [statuses, bathTypes, rooms]);

  return {
    rooms: activeRooms,
    openRooms,
    statuses,
    defectTexts,
    bathTypes,
    activeDefect,
    stats,
    isLoadingState,
    viewMode,
    setViewMode: handleSetViewMode,
    toggleRoom,
    setItemStatus,
    setDefectText,
    setBathType,
    setActiveDefect,
  };
}
