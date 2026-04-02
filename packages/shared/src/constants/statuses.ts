import { COLORS } from '@infield/ui';

// Defect lifecycle: open → in_progress → fixed / not_fixed
export const DEFECT_STATUSES = [
  {
    value: 'open' as const,
    label: 'פתוח',
    color: COLORS.danger[500],
    backgroundColor: COLORS.danger[50],
  },
  {
    value: 'in_progress' as const,
    label: 'בטיפול',
    color: COLORS.warning[500],
    backgroundColor: COLORS.warning[50],
  },
  {
    value: 'fixed' as const,
    label: 'תוקן',
    color: COLORS.success[500],
    backgroundColor: COLORS.success[50],
  },
  {
    value: 'not_fixed' as const,
    label: 'לא תוקן',
    color: COLORS.danger[500],
    backgroundColor: COLORS.danger[50],
  },
] as const;

// Report lifecycle: draft → in_progress → completed → sent
export const REPORT_STATUSES = [
  { value: 'draft' as const, label: 'טיוטה', color: COLORS.neutral[400] },
  {
    value: 'in_progress' as const,
    label: 'בביצוע',
    color: COLORS.warning[500],
  },
  { value: 'completed' as const, label: 'הושלם', color: COLORS.success[500] },
  { value: 'sent' as const, label: 'נשלח', color: COLORS.primary[500] },
] as const;

export const PROJECT_STATUSES = [
  { value: 'active' as const, label: 'פעיל', color: COLORS.success[500] },
  { value: 'completed' as const, label: 'הושלם', color: COLORS.primary[500] },
  { value: 'archived' as const, label: 'בארכיון', color: COLORS.neutral[400] },
] as const;

export const APARTMENT_STATUSES = [
  { value: 'pending' as const, label: 'ממתין', color: COLORS.neutral[400] },
  {
    value: 'in_progress' as const,
    label: 'בביצוע',
    color: COLORS.warning[500],
  },
  { value: 'delivered' as const, label: 'נמסר', color: COLORS.success[500] },
  { value: 'completed' as const, label: 'הושלם', color: COLORS.primary[500] },
] as const;
