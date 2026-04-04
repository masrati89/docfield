import { useState, useMemo, useCallback } from 'react';

import { CHECKLIST_ROOMS } from '@/components/checklist/constants';
import type {
  ChecklistStatus,
  StatusMap,
  DefectTextMap,
  BathTypeMap,
  OpenMap,
} from '@/components/checklist/types';

export function useChecklist() {
  const [openRooms, setOpenRooms] = useState<OpenMap>({ entrance: true });
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [defectTexts, setDefectTexts] = useState<DefectTextMap>({});
  const [bathTypes, setBathTypes] = useState<BathTypeMap>({
    bath_master: 'shower',
  });
  const [activeDefect, setActiveDefect] = useState<string | null>(null);

  // Toggle room — one room at a time (accordion)
  const toggleRoom = useCallback((roomId: string) => {
    setOpenRooms((prev) => {
      const newMap: OpenMap = {};
      Object.keys(prev).forEach((k) => (newMap[k] = false));
      newMap[roomId] = !prev[roomId];
      return newMap;
    });
  }, []);

  // Set item status
  const setItemStatus = useCallback(
    (itemId: string, status: ChecklistStatus) => {
      setStatuses((prev) => ({ ...prev, [itemId]: status }));
      if (status !== 'defect' && status !== 'partial') {
        setDefectTexts((prev) => {
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
      }
    },
    []
  );

  // Set defect text
  const setDefectText = useCallback((itemId: string, text: string) => {
    setDefectTexts((prev) => ({ ...prev, [itemId]: text }));
  }, []);

  // Set bath type
  const setBathType = useCallback(
    (roomId: string, value: 'shower' | 'bath') => {
      setBathTypes((prev) => ({ ...prev, [roomId]: value }));
    },
    []
  );

  // Computed stats
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
    toggleRoom,
    setItemStatus,
    setDefectText,
    setBathType,
    setActiveDefect,
  };
}
