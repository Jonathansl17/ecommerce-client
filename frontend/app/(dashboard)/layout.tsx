import { NotificationBell } from '@/features/notifications/NotificationBell';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="/dashboard" className="text-lg font-bold tracking-tight text-gray-900 hover:text-gray-700 transition-colors">
            Ecommerce
          </a>

          <nav className="flex items-center gap-6" aria-label="Navegación principal">
            <a
              href="/catalogo"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Catálogo
            </a>
            <div className="h-5 w-px bg-gray-200" />
            <NotificationBell />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
