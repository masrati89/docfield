// Defect categories for construction inspections
// Final 20-category list — see DEFECT_LIBRARY_PLAN (2026-04-10) for the
// mapping from the 29 source categories in the 338-defect library.
export const DEFECT_CATEGORIES = [
  { value: 'אינסטלציה', label: 'אינסטלציה (מים וביוב)', icon: 'droplets' },
  { value: 'כלים סניטריים', label: 'כלים סניטריים', icon: 'bath' },
  { value: 'אלומיניום', label: 'אלומיניום', icon: 'panel-top' },
  {
    value: 'דלתות פנים ונגרות',
    label: 'דלתות פנים ונגרות',
    icon: 'door-closed',
  },
  { value: 'מסגרות ברזל ומעקות', label: 'מסגרות ברזל ומעקות', icon: 'shield' },
  { value: 'חשמל', label: 'חשמל', icon: 'zap' },
  { value: 'טיח ושפכטל', label: 'טיח ושפכטל', icon: 'paint-roller' },
  { value: 'צביעה', label: 'צביעה', icon: 'brush' },
  { value: 'איטום', label: 'איטום', icon: 'umbrella' },
  { value: 'רטיבות ועובש', label: 'רטיבות ועובש', icon: 'droplet' },
  {
    value: 'ריצוף וחיפוי קרמיקה',
    label: 'ריצוף וחיפוי קרמיקה',
    icon: 'grid-3x3',
  },
  { value: 'אבן ושיש', label: 'אבן ושיש', icon: 'layers' },
  { value: 'גבס', label: 'גבס', icon: 'square' },
  { value: 'מעלית', label: 'מעלית', icon: 'arrow-up-down' },
  { value: 'חדר מדרגות', label: 'חדר מדרגות', icon: 'align-justify' },
  { value: 'לובי ורכוש משותף', label: 'לובי ורכוש משותף', icon: 'building' },
  { value: 'כיבוי אש', label: 'כיבוי אש', icon: 'flame' },
  { value: 'מיזוג אוויר', label: 'מיזוג אוויר', icon: 'thermometer' },
  { value: 'נגישות', label: 'נגישות', icon: 'accessibility' },
  { value: 'גז', label: 'גז', icon: 'flame' },
] as const;

export type DefectCategoryValue = (typeof DEFECT_CATEGORIES)[number]['value'];

export const CATEGORY_LABELS: Record<DefectCategoryValue, string> =
  Object.fromEntries(
    DEFECT_CATEGORIES.map((category) => [category.value, category.label])
  ) as Record<DefectCategoryValue, string>;
