import { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { useReports } from '@/hooks/useReports';
import { useProjects } from '@/hooks/useProjects';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';
import { EmptyState } from '@/components/ui/EmptyState';
import { PressableScale } from '@/components/ui';

// --- Types ---

interface StatCardProps {
  label: string;
  value: number;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bg: string;
  delay: number;
}

interface BarItem {
  label: string;
  value: number;
  color: string;
}

// --- Stat Card ---

function StatCard({ label, value, icon, color, bg, delay }: StatCardProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(300)}
      style={{
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        borderRadius: 12,
        padding: 14,
        gap: 8,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'flex-end',
        }}
      >
        <Feather name={icon} size={18} color={color} />
      </View>
      <Text
        style={{
          fontSize: 28,
          fontFamily: 'Rubik-Bold',
          color: COLORS.neutral[800],
          textAlign: 'right',
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[500],
          textAlign: 'right',
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

// --- Horizontal Bar ---

function HorizontalBar({
  items,
  title,
  delay,
}: {
  items: BarItem[];
  title: string;
  delay: number;
}) {
  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(300)}
      style={{
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        borderRadius: 12,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'Rubik-SemiBold',
          color: COLORS.neutral[700],
          textAlign: 'right',
          marginBottom: 14,
        }}
      >
        {title}
      </Text>
      {items.map((item, index) => (
        <View
          key={item.label}
          style={{ marginBottom: index < items.length - 1 ? 12 : 0 }}
        >
          <View
            style={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-Medium',
                color: COLORS.neutral[600],
              }}
            >
              {item.label}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[800],
              }}
            >
              {item.value}
            </Text>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: COLORS.cream[100],
              borderRadius: 4,
              overflow: 'hidden',
              direction: 'rtl',
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color,
                borderRadius: 4,
              }}
            />
          </View>
        </View>
      ))}
    </Animated.View>
  );
}

// --- Project Row ---

function ProjectStatRow({
  name,
  done,
  total,
  openDefects,
  delay,
}: {
  name: string;
  done: number;
  total: number;
  openDefects: number;
  delay: number;
}) {
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(200)}
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cream[100],
        gap: 10,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Rubik-Medium',
            color: COLORS.neutral[700],
            textAlign: 'right',
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[500],
            textAlign: 'right',
            marginTop: 2,
          }}
        >
          {done}/{total} דירות ({progress}%)
        </Text>
      </View>
      {openDefects > 0 && (
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 10,
            backgroundColor: COLORS.danger[50],
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Rubik-Medium',
              color: COLORS.danger[500],
            }}
          >
            {openDefects} פתוחים
          </Text>
        </View>
      )}
      <View
        style={{
          width: 60,
          height: 6,
          borderRadius: 3,
          backgroundColor: COLORS.cream[200],
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor:
              progress === 100 ? COLORS.primary[500] : COLORS.gold[500],
            borderRadius: 3,
          }}
        />
      </View>
    </Animated.View>
  );
}

// --- Loading Skeleton ---

function StatsSkeleton() {
  return (
    <View style={{ padding: 16, gap: 16 }}>
      <View style={{ flexDirection: 'row-reverse', gap: 10 }}>
        <SkeletonBlock width="50%" height={120} borderRadius={12} />
        <SkeletonBlock width="50%" height={120} borderRadius={12} />
      </View>
      <View style={{ flexDirection: 'row-reverse', gap: 10 }}>
        <SkeletonBlock width="50%" height={120} borderRadius={12} />
        <SkeletonBlock width="50%" height={120} borderRadius={12} />
      </View>
      <SkeletonBlock width="100%" height={200} borderRadius={12} />
    </View>
  );
}

// --- Screen ---

export default function StatisticsScreen() {
  const router = useRouter();
  const {
    reports,
    isLoading: reportsLoading,
    isRefreshing: reportsRefreshing,
    error: reportsError,
    refetch: refetchReports,
  } = useReports();
  const {
    projects,
    isLoading: projectsLoading,
    isRefreshing: projectsRefreshing,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects();

  const isLoading = reportsLoading || projectsLoading;
  const isRefreshing = reportsRefreshing || projectsRefreshing;
  const hasError = (reportsError || projectsError) && !isLoading;

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchReports(), refetchProjects()]);
  }, [refetchReports, refetchProjects]);

  // --- Computed stats ---

  const stats = useMemo(() => {
    const totalReports = reports.length;
    const drafts = reports.filter(
      (r) => r.status === 'draft' || r.status === 'in_progress'
    ).length;
    const completed = reports.filter(
      (r) => r.status === 'completed' || r.status === 'sent'
    ).length;
    const deliveryCount = reports.filter(
      (r) => r.reportType === 'delivery'
    ).length;
    const bedekCount = reports.filter(
      (r) => r.reportType === 'bedek_bait'
    ).length;
    const totalDefects = reports.reduce((sum, r) => sum + r.defectCount, 0);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = reports.filter(
      (r) => new Date(r.updatedAt) >= monthStart
    ).length;

    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const thisWeek = reports.filter(
      (r) => new Date(r.updatedAt) >= weekStart
    ).length;

    const activeProjects = projects.filter((p) => p.status === 'active');
    const totalApts = activeProjects.reduce(
      (sum, p) => sum + (p.totalApts || 0),
      0
    );
    const completedApts = activeProjects.reduce(
      (sum, p) => sum + p.completedApts,
      0
    );
    const totalOpenDefects = activeProjects.reduce(
      (sum, p) => sum + p.openDefects,
      0
    );

    return {
      totalReports,
      drafts,
      completed,
      deliveryCount,
      bedekCount,
      totalDefects,
      thisMonth,
      thisWeek,
      activeProjects: activeProjects.length,
      totalApts,
      completedApts,
      totalOpenDefects,
      projectsList: activeProjects,
    };
  }, [reports, projects]);

  const statusBars: BarItem[] = useMemo(
    () => [
      { label: 'הושלמו', value: stats.completed, color: COLORS.primary[500] },
      { label: 'טיוטות', value: stats.drafts, color: COLORS.gold[500] },
    ],
    [stats]
  );

  const typeBars: BarItem[] = useMemo(
    () => [
      {
        label: 'פרוטוקול מסירה',
        value: stats.deliveryCount,
        color: COLORS.primary[500],
      },
      {
        label: 'בדק בית',
        value: stats.bedekCount,
        color: COLORS.gold[500],
      },
    ],
    [stats]
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: COLORS.cream[50] }}
    >
      <StatusBar style="dark" animated />

      {/* Header */}
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          gap: 12,
        }}
      >
        <PressableScale onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={COLORS.neutral[700]} />
        </PressableScale>
        <Text
          style={{
            fontSize: 22,
            fontFamily: 'Rubik-Bold',
            color: COLORS.neutral[800],
            flex: 1,
            textAlign: 'right',
          }}
        >
          סטטיסטיקות
        </Text>
        <Feather name="bar-chart-2" size={22} color={COLORS.primary[500]} />
      </Animated.View>

      {/* Content */}
      {isLoading ? (
        <StatsSkeleton />
      ) : hasError ? (
        <EmptyState
          icon="alert-circle"
          title="שגיאה בטעינה"
          subtitle="לא הצלחנו לטעון את הנתונים"
          ctaLabel="נסה שוב"
          onCta={handleRefresh}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 88, gap: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary[500]}
              colors={[COLORS.primary[500]]}
            />
          }
        >
          {/* Top stat cards — 2x2 grid */}
          <View style={{ flexDirection: 'row-reverse', gap: 10 }}>
            <StatCard
              label="סה״כ דוחות"
              value={stats.totalReports}
              icon="file-text"
              color={COLORS.primary[600]}
              bg={COLORS.primary[50]}
              delay={0}
            />
            <StatCard
              label="סה״כ ממצאים"
              value={stats.totalDefects}
              icon="alert-triangle"
              color={COLORS.gold[600]}
              bg={COLORS.gold[100]}
              delay={60}
            />
          </View>
          <View style={{ flexDirection: 'row-reverse', gap: 10 }}>
            <StatCard
              label="השבוע"
              value={stats.thisWeek}
              icon="calendar"
              color={COLORS.primary[600]}
              bg={COLORS.primary[50]}
              delay={120}
            />
            <StatCard
              label="החודש"
              value={stats.thisMonth}
              icon="trending-up"
              color={COLORS.gold[600]}
              bg={COLORS.gold[100]}
              delay={180}
            />
          </View>

          {/* Reports by status */}
          <HorizontalBar
            title="דוחות לפי סטטוס"
            items={statusBars}
            delay={240}
          />

          {/* Reports by type */}
          <HorizontalBar title="דוחות לפי סוג" items={typeBars} delay={300} />

          {/* Projects overview */}
          {stats.projectsList.length > 0 && (
            <Animated.View
              entering={FadeInUp.delay(360).duration(300)}
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: COLORS.cream[200],
                borderRadius: 12,
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Rubik-SemiBold',
                    color: COLORS.neutral[700],
                  }}
                >
                  התקדמות פרויקטים
                </Text>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                    backgroundColor: COLORS.primary[50],
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'Rubik-Medium',
                      color: COLORS.primary[600],
                    }}
                  >
                    {stats.completedApts}/{stats.totalApts} דירות
                  </Text>
                </View>
              </View>

              {stats.projectsList.map((project, index) => (
                <ProjectStatRow
                  key={project.id}
                  name={project.name}
                  done={project.completedApts}
                  total={project.totalApts}
                  openDefects={project.openDefects}
                  delay={380 + index * 40}
                />
              ))}
            </Animated.View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
