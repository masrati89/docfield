// Defect categories for construction inspections
// Final 20-category list — see DEFECT_LIBRARY_PLAN (2026-04-10) for the
// mapping from the 29 source categories in the 338-defect library.
export const DEFECT_CATEGORIES = [
  { value: 'plumbing', label: 'אינסטלציה (מים וביוב)', icon: 'droplets' },
  { value: 'sanitary', label: 'כלים סניטריים', icon: 'bath' },
  { value: 'aluminum', label: 'אלומיניום', icon: 'panel-top' },
  { value: 'interior_doors', label: 'דלתות פנים ונגרות', icon: 'door-closed' },
  { value: 'steel_frames', label: 'מסגרות ברזל ומעקות', icon: 'shield' },
  { value: 'electrical', label: 'חשמל', icon: 'zap' },
  { value: 'plaster', label: 'טיח ושפכטל', icon: 'paint-roller' },
  { value: 'painting', label: 'צביעה', icon: 'brush' },
  { value: 'waterproofing', label: 'איטום', icon: 'umbrella' },
  { value: 'moisture', label: 'רטיבות ועובש', icon: 'droplet' },
  { value: 'tiling', label: 'ריצוף וחיפוי קרמיקה', icon: 'grid-3x3' },
  { value: 'stonework', label: 'אבן ושיש', icon: 'layers' },
  { value: 'gypsum', label: 'גבס', icon: 'square' },
  { value: 'elevator', label: 'מעלית', icon: 'arrow-up-down' },
  { value: 'stairs', label: 'חדר מדרגות', icon: 'align-justify' },
  { value: 'lobby', label: 'לובי ורכוש משותף', icon: 'building' },
  { value: 'fire', label: 'כיבוי אש', icon: 'flame' },
  { value: 'hvac', label: 'מיזוג אוויר', icon: 'thermometer' },
  { value: 'accessibility', label: 'נגישות', icon: 'accessibility' },
  { value: 'gas', label: 'גז', icon: 'flame' },
] as const;

export type DefectCategoryValue = (typeof DEFECT_CATEGORIES)[number]['value'];

export const CATEGORY_LABELS: Record<DefectCategoryValue, string> =
  Object.fromEntries(
    DEFECT_CATEGORIES.map((category) => [category.value, category.label])
  ) as Record<DefectCategoryValue, string>;
