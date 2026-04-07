// Defect categories for construction inspections
export const DEFECT_CATEGORIES = [
  { value: 'plumbing', label: 'אינסטלציה', icon: 'droplets' },
  { value: 'sanitary', label: 'אינסטלציה סניטריית', icon: 'bath' },
  { value: 'aluminum', label: 'אלומיניום', icon: 'panel-top' },
  { value: 'interior_doors', label: 'דלתות פנים ונגרות', icon: 'door-closed' },
  { value: 'steel_frames', label: 'מסגרות ברזל וממ"ד', icon: 'shield' },
  { value: 'electrical', label: 'חשמל', icon: 'zap' },
  { value: 'plaster', label: 'טיח וצבע', icon: 'paint-roller' },
  { value: 'waterproofing', label: 'איטום', icon: 'umbrella' },
  { value: 'leaks', label: 'נזילות', icon: 'droplet' },
  { value: 'tiling', label: 'ריצוף וחיפוי קרמיקה', icon: 'grid-3x3' },
  { value: 'stonework', label: 'עבודות אבן ושיש', icon: 'layers' },
  { value: 'structure', label: 'שלד ומבנה', icon: 'building-2' },
  { value: 'earthwork', label: 'פיתוח ועבודות עפר', icon: 'shovel' },
  { value: 'paving', label: 'אבנים משתלבות', icon: 'grid' },
  { value: 'elevator', label: 'מעלית', icon: 'arrow-up-down' },
  { value: 'roof', label: 'מערכות הגג', icon: 'home' },
  { value: 'gypsum', label: 'גבס', icon: 'square' },
  { value: 'stairs', label: 'מדרגות', icon: 'align-justify' },
  { value: 'garden', label: 'גינון', icon: 'trees' },
  { value: 'lobby', label: 'לובי ורכוש משותף', icon: 'building' },
  { value: 'fire', label: 'כיבוי אש', icon: 'flame' },
  { value: 'hvac', label: 'מיזוג אוויר', icon: 'thermometer' },
  { value: 'accessibility', label: 'נגישות', icon: 'accessibility' },
] as const;

export type DefectCategoryValue = (typeof DEFECT_CATEGORIES)[number]['value'];

export const CATEGORY_LABELS: Record<DefectCategoryValue, string> =
  Object.fromEntries(
    DEFECT_CATEGORIES.map((category) => [category.value, category.label])
  ) as Record<DefectCategoryValue, string>;
