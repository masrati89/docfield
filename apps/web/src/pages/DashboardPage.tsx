import { useCallback, useEffect, useState } from 'react';
import {
  Building2,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';

import { StatCard } from '@/components/ui/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  projectCount: number;
  reportCount: number;
  openDefects: number;
  fixedDefects: number;
}

export function DashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [projectsResult, reportsResult, openDefectsResult, fixedDefectsResult] =
        await Promise.all([
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('delivery_reports').select('id', { count: 'exact', head: true }),
          supabase
            .from('defects')
            .select('id', { count: 'exact', head: true })
            .in('status', ['open', 'in_progress']),
          supabase
            .from('defects')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'fixed'),
        ]);

      setStats({
        projectCount: projectsResult.count ?? 0,
        reportCount: reportsResult.count ?? 0,
        openDefects: openDefectsResult.count ?? 0,
        fixedDefects: fixedDefectsResult.count ?? 0,
      });
    } catch {
      setError('שגיאה בטעינת הנתונים');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      label: 'פרויקטים פעילים',
      value: String(stats?.projectCount ?? 0),
      icon: Building2,
      color: 'primary' as const,
    },
    {
      label: 'דוחות',
      value: String(stats?.reportCount ?? 0),
      icon: ClipboardCheck,
      color: 'info' as const,
    },
    {
      label: 'ליקויים פתוחים',
      value: String(stats?.openDefects ?? 0),
      icon: AlertTriangle,
      color: 'warning' as const,
    },
    {
      label: 'ליקויים שתוקנו',
      value: String(stats?.fixedDefects ?? 0),
      icon: CheckCircle,
      color: 'success' as const,
    },
  ];

  return (
    <div className="p-8">
      {/* Page header */}
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-rubik font-bold text-neutral-800">
            שלום{profile?.fullName ? `, ${profile.fullName}` : ''}!
          </h2>
          <p className="text-sm font-rubik text-neutral-500 mt-1">
            סקירה כללית של הפרויקטים שלך
          </p>
        </div>
        <button
          type="button"
          onClick={fetchStats}
          disabled={isLoading}
          className="p-2 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-cream-100 transition-colors duration-200 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
          aria-label="רענן נתונים"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </header>

      {/* Error state */}
      {error && (
        <div className="bg-danger-50 border border-danger-500 rounded-[10px] px-4 py-3 mb-6">
          <p className="text-[13px] font-rubik text-danger-700">{error}</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-cream-200 p-5 animate-pulse"
              >
                <div className="h-4 bg-cream-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-cream-200 rounded w-1/3" />
              </div>
            ))
          : statCards.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      {/* Recent activity placeholder */}
      <div className="mt-8 bg-white rounded-lg border border-cream-200 p-8 text-center">
        <p className="text-sm font-rubik text-neutral-400">
          פעילות אחרונה תופיע כאן
        </p>
      </div>
    </div>
  );
}
