import { Platform, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';

// --- Types ---

export type StatusFilter = 'all' | 'active' | 'completed';
export type SortBy = 'name' | 'activity' | 'progress' | 'defects';

// --- Constants ---

export const STATUS_CHIPS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'הכל' },
  { key: 'active', label: 'פעילים' },
  { key: 'completed', label: 'הושלמו' },
];

export const SORT_OPTIONS: { key: SortBy; label: string }[] = [
  { key: 'name', label: 'שם (א-ת)' },
  { key: 'activity', label: 'פעילות אחרונה' },
  { key: 'progress', label: 'התקדמות' },
  { key: 'defects', label: 'ליקויים פתוחים' },
];

export const SORT_TAG_LABELS: Record<string, string> = {
  activity: 'פעילות אחרונה',
  progress: 'התקדמות',
  defects: 'ליקויים פתוחים',
};

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
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${d}.${m}`;
}

export function haptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

// --- Animated ---

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
