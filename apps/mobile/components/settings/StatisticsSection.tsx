import { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';

// --- Types ---

interface StatisticsSectionProps {
  organizationId?: string;
}

interface Stats {
  totalReports: number;
  totalDefects: number;
  bedekBait: number;
  delivery: number;
  completed: number;
  thisMonth: number;
}

const STAT_CARDS: { key: keyof Stats; label: string }[] = [
  { key: 'totalReports', label: 'סה"כ דוחות' },
  { key: 'totalDefects', label: 'ממצאים' },
  { key: 'bedekBait', label: 'בדק בית' },
  { key: 'delivery', label: 'פרוטוקול מסירה' },
  { key: 'completed', label: 'הושלמו' },
  { key: 'thisMonth', label: 'החודש' },
];

// --- Component ---

export function StatisticsSection({ organizationId }: StatisticsSectionProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!organizationId) return;
    setLoading(true);
    try {
      const [reportsRes, defectsRes] = await Promise.all([
        supabase
          .from('delivery_reports')
          .select('id, report_type, status, created_at')
          .eq('organization_id', organizationId),
        supabase
          .from('defects')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', organizationId),
      ]);

      const reports = reportsRes.data ?? [];
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      setStats({
        totalReports: reports.length,
        totalDefects: defectsRes.count ?? 0,
        bedekBait: reports.filter((r) => r.report_type === 'bedek_bait').length,
        delivery: reports.filter((r) => r.report_type === 'delivery').length,
        completed: reports.filter((r) => r.status === 'completed').length,
        thisMonth: reports.filter((r) => new Date(r.created_at) >= monthStart)
          .length,
      });
    } catch {
      // Silently fail — stats are non-critical
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  if (!organizationId) return null;

  return (
    <Animated.View
      entering={FadeInUp.delay(500).duration(300)}
      className="mb-[24px]"
    >
      <Text className="text-[18px] font-rubik-semibold text-neutral-800 text-right px-[20px] mb-[12px]">
        סטטיסטיקות
      </Text>

      <View className="px-[20px]">
        <View className="flex-row-reverse flex-wrap gap-[10px]">
          {STAT_CARDS.map((card) => (
            <View
              key={card.key}
              className="flex-1 min-w-[140px] bg-cream-100 border border-cream-200 rounded-[12px] p-[14px] items-center"
            >
              {loading ? (
                <SkeletonBlock width={48} height={28} borderRadius={6} />
              ) : (
                <Text className="text-[24px] font-rubik-bold text-primary-500">
                  {stats?.[card.key] ?? 0}
                </Text>
              )}
              <Text className="text-[12px] font-rubik-medium text-neutral-500 mt-[2px]">
                {card.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}
