import { Platform, Pressable } from 'react-native';
import * as Haptics from '@/lib/haptics';
import Animated from 'react-native-reanimated';

import { COLORS } from '@infield/ui';

// --- Types ---

export type StatusFilter = 'all' | 'active' | 'completed';
export type SortBy = 'date' | 'project';
export type TypeFilter = 'all' | 'delivery' | 'bedek_bait';

// --- Constants ---

export const STATUS_CONFIG = {
  draft: {
    label: 'טיוטה',
    color: COLORS.neutral[600],
    bg: COLORS.cream[200],
    dot: COLORS.neutral[400],
  },
  in_progress: {
    label: 'בעבודה',
    color: COLORS.gold[700],
    bg: COLORS.gold[100],
    dot: COLORS.gold[500],
  },
  completed: {
    label: 'הושלם',
    color: COLORS.primary[700],
    bg: COLORS.primary[50],
    dot: COLORS.primary[500],
  },
  sent: {
    label: 'נשלח',
    color: COLORS.primary[700],
    bg: COLORS.primary[100],
    dot: COLORS.primary[500],
  },
} as const;

export const TYPE_LABELS: Record<string, string> = {
  delivery: 'מסירה',
  bedek_bait: 'בדק בית',
};

export const STATUS_CHIPS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'הכל' },
  { key: 'active', label: 'פעילים' },
  { key: 'completed', label: 'הושלמו' },
];

// --- Helpers ---

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'עכשיו';
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays === 1) return 'אתמול';
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${d}.${m}`;
}

export function haptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

// --- Animated component ---

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
