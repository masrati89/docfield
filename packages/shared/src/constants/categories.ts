// Defect categories for construction inspections
// Icons reference lucide-react-native icon names

export const DEFECT_CATEGORIES = [
  { value: 'plaster', label: 'טיח', icon: 'paint-roller' },
  { value: 'painting', label: 'צביעה', icon: 'paintbrush' },
  { value: 'tiling', label: 'ריצוף', icon: 'grid-3x3' },
  { value: 'wall_cladding', label: 'חיפוי קירות', icon: 'brick-wall' },
  { value: 'plumbing', label: 'אינסטלציה', icon: 'droplets' },
  { value: 'electrical', label: 'חשמל', icon: 'zap' },
  { value: 'carpentry', label: 'נגרות', icon: 'door-closed' },
  { value: 'aluminum', label: 'אלומיניום', icon: 'panel-top' },
  { value: 'waterproofing', label: 'איטום', icon: 'umbrella' },
  { value: 'cleaning', label: 'ניקיון', icon: 'sparkles' },
  { value: 'hvac', label: 'מיזוג אוויר', icon: 'thermometer' },
  { value: 'gas', label: 'גז', icon: 'flame' },
  { value: 'elevators', label: 'מעליות', icon: 'arrow-up-down' },
  { value: 'general', label: 'כללי', icon: 'clipboard' },
] as const;

export type DefectCategoryValue = (typeof DEFECT_CATEGORIES)[number]['value'];

export const CATEGORY_LABELS: Record<DefectCategoryValue, string> = Object.fromEntries(
  DEFECT_CATEGORIES.map((category) => [category.value, category.label]),
) as Record<DefectCategoryValue, string>;
