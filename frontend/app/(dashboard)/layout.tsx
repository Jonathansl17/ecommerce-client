'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { ROUTES } from '@/lib/constants/routes.constants';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientSidebar } from '@/components/layout/ClientSidebar';

const PUBLIC_PATH_PREFIXES = ['/catalogo', '/productos'];

function isPublicPath(pathname: string | null): boolean {
  if (pathname == null) return false;
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const publicPath = isPublicPath(pathname);

  useEffect(() => {
    if (publicPath) return;
    if (isLoading) return;
    if (!isAuthenticated) router.replace(ROUTES.LOGIN);
  }, [publicPath, isLoading, isAuthenticated, router]);

  if (!publicPath && (isLoading || !isAuthenticated)) return null;

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader onMenuOpen={() => setMobileOpen(true)} />

      {/* Sidebar desktop */}
      <ClientSidebar />

      {/* Sidebar móvil (overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar pt-16">
            <ClientSidebar />
          </div>
        </div>
      )}

      <main className="md:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
