import { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { COLORS } from '@infield/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/hooks/useReports';
import { useProjects } from '@/hooks/useProjects';
import { useSideMenu } from '@/hooks/useSideMenu';
import { NewInspectionWizard } from '@/components/wizard';
import { EmptyState } from '@/components/ui/EmptyState';
import { NotificationsPanel } from '@/components/ui/NotificationsPanel';
import { SideMenu } from '@/components/ui/SideMenu';

import {
  HomeHeader,
  ActionCard,
  ProgressCard,
  StatsStrip,
  ReportsSection,
  ProjectsSection,
  ToolGrid,
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
  const [showNewInspection, setShowNewInspection] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { isOpen: menuOpen, open: openMenu, close: closeMenu } = useSideMenu();

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

  const completedThisMonth = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return allReports.filter(
      (r) =>
        (r.status === 'completed' || r.status === 'sent') &&
        new Date(r.updatedAt) >= monthStart
    ).length;
  }, [allReports]);

  // Overall progress across all active projects
  const { doneUnits, totalUnits } = useMemo(() => {
    const activeProjects = allProjects.filter((p) => p.status === 'active');
    return {
      doneUnits: activeProjects.reduce((sum, p) => sum + p.completedApts, 0),
      totalUnits: activeProjects.reduce(
        (sum, p) => sum + (p.totalApts || 0),
        0
      ),
    };
  }, [allProjects]);

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

  const handleNewInspection = useCallback(() => {
    setShowNewInspection(true);
  }, []);

  const handleToolPress = useCallback(
    (label: string) => {
      switch (label) {
        case 'מאגר ממצאים':
          router.push('/(app)/library');
          break;
        case 'סטטיסטיקות':
          router.push('/(app)/statistics');
          break;
        case 'תבניות':
          router.push('/(app)/settings/templates');
          break;
        case 'עזרה':
          router.push('/(app)/help');
          break;
      }
    },
    [router]
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream[100] }}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={bothFailed ? { flex: 1 } : { paddingBottom: 88 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary[500]}
            colors={[COLORS.primary[500]]}
          />
        }
      >
        {/* Gradient header */}
        <HomeHeader
          userName={userName}
          onBell={() => setNotificationsOpen(true)}
          onMenu={openMenu}
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
            {/* Action card + stats */}
            <View
              style={{ padding: 14, paddingHorizontal: 16, paddingBottom: 0 }}
            >
              <ActionCard onPress={handleNewInspection} />
              <StatsStrip
                draftsCount={draftsCount}
                completedThisMonth={completedThisMonth}
                isLoading={isLoading}
              />
            </View>

            {/* Progress card */}
            <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
              <ProgressCard
                doneUnits={doneUnits}
                totalUnits={totalUnits}
                isLoading={isLoading}
              />
            </View>

            {/* Reports section */}
            <View style={{ marginHorizontal: 16, marginTop: 14 }}>
              {reportsError && !reportsLoading ? (
                <EmptyState
                  icon="alert-circle"
                  title="שגיאה בטעינת דוחות"
                  subtitle="לא הצלחנו לטעון את הדוחות"
                  ctaLabel="נסה שוב"
                  onCta={refetchReports}
                />
              ) : (
                <ReportsSection
                  reports={reports}
                  isLoading={isLoading}
                  onViewAll={() => router.push('/(app)/reports')}
                  onReportPress={(id) => router.push(`/(app)/reports/${id}`)}
                />
              )}
            </View>

            {/* Projects section */}
            <View style={{ marginHorizontal: 16, marginTop: 12 }}>
              {projectsError && !projectsLoading ? (
                <EmptyState
                  icon="alert-circle"
                  title="שגיאה בטעינת פרויקטים"
                  subtitle="לא הצלחנו לטעון את הפרויקטים"
                  ctaLabel="נסה שוב"
                  onCta={refetchProjects}
                />
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
            </View>

            {/* Tools grid */}
            <View style={{ marginHorizontal: 16 }}>
              <ToolGrid onToolPress={handleToolPress} />
            </View>

            <View style={{ height: 20 }} />
          </>
        )}
      </ScrollView>

      <NewInspectionWizard
        visible={showNewInspection}
        onClose={() => setShowNewInspection(false)}
      />

      <SideMenu visible={menuOpen} onClose={closeMenu} />
      <NotificationsPanel
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </View>
  );
}
