'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { NotificationBell } from '@/features/notifications/NotificationBell';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAV_TITLE = 'Ecommerce';
const LOGIN_TEXT = 'Iniciar sesión';
const REGISTER_TEXT = 'Registrarse';
const CATALOG_TEXT = 'Catálogo';
const LOGOUT_TEXT = 'Cerrar sesión';

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
          >
            {NAV_TITLE}
          </Link>

          <nav className="flex items-center gap-6" aria-label="Navegación principal">
            <Link
              href="/catalogo"
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              {CATALOG_TEXT}
            </Link>

            <div className="h-5 w-px bg-foreground/20" />

            {isLoading ? null : isAuthenticated ? (
              <>
                <span className="text-sm text-foreground/70">
                  {user?.fullName}
                </span>
                <NotificationBell />
                <button
                  onClick={logout}
                  className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  {LOGOUT_TEXT}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  {LOGIN_TEXT}
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-foreground text-background px-4 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {REGISTER_TEXT}
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
