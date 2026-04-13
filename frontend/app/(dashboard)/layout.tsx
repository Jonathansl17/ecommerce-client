'use client';

import { useState } from 'react';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientSidebar } from '@/components/layout/ClientSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
