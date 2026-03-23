// Report types — MVP supports delivery, rest planned for future
// Icons reference lucide-react-native icon names

export const REPORT_TYPES = [
  { value: 'delivery', label: 'מסירת דירה', icon: 'key' },
  { value: 'bedek_bait', label: 'בדק בית', icon: 'search' },
  { value: 'supervision', label: 'פיקוח', icon: 'hard-hat' },
  { value: 'leak_detection', label: 'איתור נזילות', icon: 'droplets' },
  { value: 'public_areas', label: 'שטחים ציבוריים', icon: 'building' },
] as const;

export type ReportTypeValue = (typeof REPORT_TYPES)[number]['value'];

export const REPORT_TYPE_LABELS: Record<ReportTypeValue, string> = Object.fromEntries(
  REPORT_TYPES.map((type) => [type.value, type.label]),
) as Record<ReportTypeValue, string>;
