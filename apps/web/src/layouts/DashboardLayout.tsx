import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  Settings,
  Plus,
  LogOut,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'דשבורד' },
  { to: '/projects', icon: Building2, label: 'פרויקטים' },
  { to: '/reports', icon: ClipboardCheck, label: 'דוחות' },
  { to: '/settings', icon: Settings, label: 'הגדרות' },
] as const;

export function DashboardLayout() {
  const { profile, signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-cream-50">
      {/* Sidebar — right side in RTL (natural position) */}
      <aside className="w-[260px] bg-white border-e border-cream-200 flex flex-col fixed inset-y-0 end-0 z-10">
        {/* Logo */}
        <div className="p-5 border-b border-cream-200">
          <h1 className="text-xl font-rubik font-bold text-primary-700">
            DocField
          </h1>
          <p className="text-xs font-rubik text-neutral-400 mt-1">
            ניהול דוחות מסירה
          </p>
        </div>

        {/* New Report CTA — single primary action */}
        <div className="p-4">
          <button
            type="button"
            className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white text-sm font-rubik font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <Plus size={18} strokeWidth={1.5} />
            דוח חדש
          </button>
        </div>

        {/* Navigation — semantic nav element */}
        <nav className="flex-1 px-3" aria-label="ניווט ראשי">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-md',
                  'text-sm font-rubik mb-1 transition-colors duration-200',
                  'focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-neutral-500 hover:bg-cream-100 hover:text-neutral-700',
                ].join(' ')
              }
            >
              <Icon size={20} strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer — user info + sign out */}
        <div className="p-4 border-t border-cream-200">
          {profile && (
            <p className="text-[13px] font-rubik text-neutral-600 mb-2 truncate">
              {profile.fullName}
            </p>
          )}
          <button
            type="button"
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-rubik text-neutral-500 hover:bg-cream-100 hover:text-neutral-700 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
          >
            <LogOut size={18} strokeWidth={1.5} />
            התנתק
          </button>
          <p className="text-[11px] font-rubik text-neutral-400 text-center mt-2">
            DocField v0.0.1
          </p>
        </div>
      </aside>

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 me-[260px]">
        <Outlet />
      </main>
    </div>
  );
}
