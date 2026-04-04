export const CHECKLIST_TEMPLATES = [
  { value: '3_rooms' as const, label: 'דירת 3 חדרים' },
  { value: '4_rooms' as const, label: 'דירת 4 חדרים' },
  { value: '5_rooms' as const, label: 'דירת 5 חדרים' },
  { value: 'garden' as const, label: 'דירת גן' },
  { value: 'cottage' as const, label: 'בית קרקע / קוטג׳' },
  { value: 'custom' as const, label: 'מותאם אישית' },
] as const;

export type ChecklistTemplateValue =
  (typeof CHECKLIST_TEMPLATES)[number]['value'];
