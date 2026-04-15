'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { NotificationBell } from '@/features/notifications/NotificationBell';
import { ROUTES } from '@/lib/constants/routes.constants';
import { DASHBOARD_NAV_STRINGS } from '@/lib/constants/auth.constants';

interface ClientHeaderProps {
  onMenuOpen: () => void;
}

export function ClientHeader({ onMenuOpen }: ClientHeaderProps) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Hamburguesa móvil */}
        <button
          onClick={onMenuOpen}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Buscador desktop */}
        <div className="mx-auto hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar productos artesanales..."
              className="w-full rounded-md border border-input bg-secondary py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Buscador toggle móvil */}
        <button
          onClick={() => setSearchOpen((s) => !s)}
          className="ml-auto rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
        >
          {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </button>

        {/* Acciones derecha */}
        <div className="flex items-center gap-2">
          {!isLoading && isAuthenticated && <NotificationBell />}

          {isLoading ? null : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                {initials}
              </div>
              <button
                onClick={logout}
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                {DASHBOARD_NAV_STRINGS.logout}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={ROUTES.LOGIN}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {DASHBOARD_NAV_STRINGS.login}
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {DASHBOARD_NAV_STRINGS.register}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Buscador móvil expandido */}
      {searchOpen && (
        <div className="px-4 pb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar productos..."
              autoFocus
              className="w-full rounded-md border border-input bg-secondary py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}
    </header>
  );
}
