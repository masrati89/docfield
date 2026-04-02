import { useCallback, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { COLORS } from '@infield/ui';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

import {
  HomeHeader,
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
  // Format as dd.mm
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${d}.${m}`;
}

// --- Screen ---

export default function HomeScreen() {
  const { profile } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [draftsCount, setDraftsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  const fetchHomeData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [draftsResult, completedResult, reportsResult, projectsResult] =
        await Promise.all([
          supabase
            .from('delivery_reports')
            .select('id', { count: 'exact', head: true })
            .in('status', ['draft', 'in_progress']),
          supabase
            .from('delivery_reports')
            .select('id', { count: 'exact', head: true })
            .in('status', ['completed', 'sent']),
          supabase
            .from('delivery_reports')
            .select(
              'id, report_type, status, report_date, updated_at, tenant_name, apartments!inner(number, buildings!inner(name, projects!inner(name, address)))'
            )
            .order('updated_at', { ascending: false })
            .limit(5),
          supabase
            .from('projects')
            .select('id, name, address, apartments(id, status)')
            .eq('status', 'active')
            .limit(3),
        ]);

      setDraftsCount(draftsResult.count ?? 0);
      setCompletedCount(completedResult.count ?? 0);

      // Map reports
      const mappedReports: ReportRow[] = (reportsResult.data ?? []).map(
        (r: Record<string, unknown>) => {
          const apt = r.apartments as Record<string, unknown> | undefined;
          const bld = apt?.buildings as Record<string, unknown> | undefined;
          const prj = bld?.projects as Record<string, unknown> | undefined;
          return {
            id: r.id as string,
            project: (prj?.name as string) ?? '',
            apartment: `דירה ${apt?.number ?? ''}, ${bld?.name ?? ''}`,
            type: (r.report_type as string) ?? 'delivery',
            status:
              (r.status as string) === 'completed' ||
              (r.status as string) === 'sent'
                ? 'done'
                : 'draft',
            defects: 0,
            time: formatRelativeTime(
              (r.updated_at as string) ?? (r.report_date as string)
            ),
          };
        }
      );
      setReports(mappedReports);

      // Map projects
      const mappedProjects: ProjectRow[] = (projectsResult.data ?? []).map(
        (p: Record<string, unknown>) => {
          const apts = (p.apartments as Array<{ status: string }>) ?? [];
          const done = apts.filter(
            (a) => a.status === 'completed' || a.status === 'delivered'
          ).length;
          return {
            id: p.id as string,
            name: (p.name as string) ?? '',
            address: (p.address as string) ?? '',
            done,
            total: apts.length || 1,
          };
        }
      );
      setProjects(mappedProjects);
    } catch {
      // Silent fail — shows empty state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const userName = profile?.fullName?.split(' ')[0] ?? '';

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: COLORS.cream[100] }}
    >
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <HomeHeader
          userName={userName}
          onNewInspection={() => {}}
          onBell={() => {}}
          onMenu={() => {}}
        />

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

        <ReportsSection
          reports={reports}
          isLoading={isLoading}
          onViewAll={() => router.push('/(app)/reports')}
          onReportPress={() => {}}
        />

        <ProjectsSection
          projects={projects}
          isLoading={isLoading}
          onViewAll={() => router.push('/(app)/projects')}
          onProjectPress={() => {}}
        />

        <ToolGrid />
      </ScrollView>
    </SafeAreaView>
  );
}
