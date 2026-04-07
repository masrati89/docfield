import { useState, useMemo, useCallback } from 'react';
import { Alert, View, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { COLORS } from '@infield/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/hooks/useReports';
import { useProjects } from '@/hooks/useProjects';
import { NewInspectionWizard } from '@/components/wizard';
import { SideMenu } from '@/components/ui/SideMenu';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSideMenu } from '@/hooks/useSideMenu';

import {
  HomeHeader,
  StatsStrip,
  ReportsSection,
  ProjectsSection,
} from '@/components/home';

// --- Types ---

interface ReportRow {
  id: string;
  project: string;
  apartment: string;
  type: string;
  status: string;
  defects: number;
  time: string;
}

interface ProjectRow {
  id: string;
  name: string;
  address: string;
  done: number;
  total: number;
  buildingsCount: number;
}

// --- Helpers ---

function formatRelativeTime(dateStr: string): string {
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

// --- Screen ---

export default function HomeScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  const { isOpen: menuOpen, open: openMenu, close: closeMenu } = useSideMenu();
  const [showNewInspection, setShowNewInspection] = useState(false);

  const {
    reports: allReports,
    isLoading: reportsLoading,
    isRefreshing: reportsRefreshing,
    error: reportsError,
    refetch: refetchReports,
  } = useReports();
  const {
    projects: allProjects,
    isLoading: projectsLoading,
    isRefreshing: projectsRefreshing,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects();

  const isLoading = reportsLoading || projectsLoading;
  const isRefreshing = reportsRefreshing || projectsRefreshing;
  const bothFailed = reportsError && projectsError && !isLoading;

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchReports(), refetchProjects()]);
  }, [refetchReports, refetchProjects]);

  const draftsCount = useMemo(
    () =>
      allReports.filter(
        (r) => r.status === 'draft' || r.status === 'in_progress'
      ).length,
    [allReports]
  );

  const completedCount = useMemo(
    () =>
      allReports.filter((r) => r.status === 'completed' || r.status === 'sent')
        .length,
    [allReports]
  );

  const reports: ReportRow[] = useMemo(
    () =>
      allReports.slice(0, 5).map((r) => ({
        id: r.id,
        project: r.project,
        apartment: r.apartment,
        type: r.reportType,
        status:
          r.status === 'completed' || r.status === 'sent' ? 'done' : 'draft',
        defects: r.defectCount,
        time: formatRelativeTime(r.updatedAt),
      })),
    [allReports]
  );

  const projects: ProjectRow[] = useMemo(
    () =>
      allProjects
        .filter((p) => p.status === 'active')
        .slice(0, 3)
        .map((p) => ({
          id: p.id,
          name: p.name,
          address: p.address,
          done: p.completedApts,
          total: p.totalApts || 1,
          buildingsCount: p.buildingsCount,
        })),
    [allProjects]
  );

  const userName = profile?.firstName || profile?.fullName?.split(' ')[0] || '';

  const handleOpenMenu = useCallback(() => {
    openMenu();
  }, [openMenu]);

  const handleNewInspection = useCallback(() => {
    setShowNewInspection(true);
  }, []);

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: COLORS.cream[50] }}
    >
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={bothFailed ? { flex: 1 } : { paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary[500]}
            colors={[COLORS.primary[500]]}
          />
        }
      >
        <HomeHeader
          userName={userName}
          onNewInspection={handleNewInspection}
          onBell={() => Alert.alert('בקרוב', 'פיצ׳ר זה יהיה זמין בקרוב')}
          onMenu={handleOpenMenu}
        />

        {bothFailed ? (
          <EmptyState
            icon="alert-circle"
            title="שגיאה בטעינה"
            subtitle="לא הצלחנו לטעון את הנתונים"
            ctaLabel="נסה שוב"
            onCta={handleRefresh}
          />
        ) : (
          <>
            {/* Separator */}
            <View
              style={{
                height: 1,
                backgroundColor: COLORS.cream[200],
                marginHorizontal: 16,
                marginTop: 12,
              }}
            />

            <StatsStrip
              draftsCount={draftsCount}
              completedCount={completedCount}
              isLoading={isLoading}
            />

            {reportsError && !reportsLoading ? (
              <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                <EmptyState
                  icon="alert-circle"
                  title="שגיאה בטעינת דוחות"
                  subtitle="לא הצלחנו לטעון את הדוחות"
                  ctaLabel="נסה שוב"
                  onCta={refetchReports}
                />
              </View>
            ) : (
              <ReportsSection
                reports={reports}
                isLoading={isLoading}
                onViewAll={() => router.push('/(app)/reports')}
                onReportPress={(id) => router.push(`/(app)/reports/${id}`)}
              />
            )}

            {projectsError && !projectsLoading ? (
              <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                <EmptyState
                  icon="alert-circle"
                  title="שגיאה בטעינת פרויקטים"
                  subtitle="לא הצלחנו לטעון את הפרויקטים"
                  ctaLabel="נסה שוב"
                  onCta={refetchProjects}
                />
              </View>
            ) : (
              <ProjectsSection
                projects={projects}
                isLoading={isLoading}
                onViewAll={() => router.push('/(app)/projects')}
                onProjectPress={(id) => {
                  const project = projects.find((p) => p.id === id);
                  if (project && project.buildingsCount <= 1) {
                    router.push(`/(app)/projects/${id}/apartments`);
                  } else {
                    router.push(`/(app)/projects/${id}/buildings`);
                  }
                }}
              />
            )}
          </>
        )}
      </ScrollView>

      <NewInspectionWizard
        visible={showNewInspection}
        onClose={() => setShowNewInspection(false)}
      />

      <SideMenu visible={menuOpen} onClose={closeMenu} />
    </SafeAreaView>
  );
}
