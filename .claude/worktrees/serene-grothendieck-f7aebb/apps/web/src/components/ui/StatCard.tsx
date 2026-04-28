import type { LucideIcon } from 'lucide-react';

const COLOR_MAP = {
  primary: {
    background: 'bg-primary-50',
    icon: 'text-primary-500',
    value: 'text-primary-700',
  },
  info: {
    background: 'bg-info-50',
    icon: 'text-info-500',
    value: 'text-info-700',
  },
  warning: {
    background: 'bg-warning-50',
    icon: 'text-warning-500',
    value: 'text-warning-700',
  },
  success: {
    background: 'bg-success-50',
    icon: 'text-success-500',
    value: 'text-success-700',
  },
} as const;

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: keyof typeof COLOR_MAP;
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <div className="bg-white rounded-lg border border-cream-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-rubik text-neutral-500">
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-md ${colors.background} flex items-center justify-center`}
        >
          <Icon size={18} strokeWidth={1.5} className={colors.icon} />
        </div>
      </div>
      <p className={`text-3xl font-inter font-bold ${colors.value}`}>
        {value}
      </p>
    </div>
  );
}
