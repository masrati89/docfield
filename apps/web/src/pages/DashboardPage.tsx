import {
  Building2,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';

const STATS = [
  { label: 'פרויקטים פעילים', value: '12', icon: Building2, color: 'primary' as const },
  { label: 'דוחות החודש', value: '34', icon: ClipboardCheck, color: 'info' as const },
  { label: 'ליקויים פתוחים', value: '67', icon: AlertTriangle, color: 'warning' as const },
  { label: 'ליקויים שתוקנו', value: '145', icon: CheckCircle, color: 'success' as const },
];

export function DashboardPage() {
  return (
    <div className="p-8">
      {/* Page header */}
      <header className="mb-8">
        <h2 className="text-2xl font-rubik font-bold text-neutral-800">
          דשבורד
        </h2>
        <p className="text-sm font-rubik text-neutral-500 mt-1">
          סקירה כללית של הפרויקטים שלך
        </p>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
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
