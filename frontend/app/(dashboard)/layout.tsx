'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { DASHBOARD_NAV_STRINGS } from '@/lib/constants/auth.constants';
import { ROUTES } from '@/lib/constants/routes.constants';
import { NotificationBell } from '@/features/notifications/NotificationBell';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href={ROUTES.DASHBOARD}
            className="text-lg font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
          >
            {DASHBOARD_NAV_STRINGS.brandTitle}
          </Link>

          <nav className="flex items-center gap-6" aria-label={DASHBOARD_NAV_STRINGS.navAriaLabel}>
            <Link
              href={ROUTES.CATALOG}
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              {DASHBOARD_NAV_STRINGS.catalog}
            </Link>

            <div className="h-5 w-px bg-foreground/20" aria-hidden="true" />

            {isLoading ? null : isAuthenticated ? (
              <>
                <span className="text-sm text-foreground/70">
                  {user?.fullName}
                </span>
                <NotificationBell />
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  {DASHBOARD_NAV_STRINGS.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  {DASHBOARD_NAV_STRINGS.login}
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="rounded-md bg-foreground text-background px-4 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {DASHBOARD_NAV_STRINGS.register}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
