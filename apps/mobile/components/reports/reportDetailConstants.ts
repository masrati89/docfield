import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import type { DefectItem } from '@/hooks/useReport';

// --- Types ---

export interface CategoryGroup {
  name: string;
  defects: DefectItem[];
  photoCount: number;
}

export type TabKey = 'findings' | 'details' | 'content' | 'shortages';

// --- Constants ---

export const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  draft: { label: 'טיוטה', bg: COLORS.primary[500], text: COLORS.white },
  in_progress: { label: 'בביצוע', bg: COLORS.warning[500], text: COLORS.white },
  completed: { label: 'הושלם', bg: COLORS.success[500], text: COLORS.white },
  sent: { label: 'נשלח', bg: COLORS.info[500], text: COLORS.white },
};

export const REPORT_TYPE_LABELS: Record<string, string> = {
  delivery: 'פרוטוקול מסירה',
  bedek_bait: 'בדק בית',
  supervision: 'פיקוח',
  leak_detection: 'איתור נזילות',
  public_areas: 'שטחים ציבוריים',
};

export const TABS: { key: TabKey; label: string }[] = [
  { key: 'findings', label: 'ממצאים' },
  { key: 'details', label: 'פרטי דוח' },
  { key: 'content', label: 'תוכן' },
  { key: 'shortages', label: 'חוסרים' },
];

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
}
