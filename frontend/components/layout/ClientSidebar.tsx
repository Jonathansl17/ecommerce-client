'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  ShoppingCart,
  Package,
  User,
  HelpCircle,
  Star,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes.constants';

const navItems = [
  { href: ROUTES.CATALOG, label: 'Catálogo', icon: ShoppingBag },
  { href: ROUTES.CART, label: 'Carrito', icon: ShoppingCart },
  { href: ROUTES.ORDERS, label: 'Mis pedidos', icon: Package },
  { href: ROUTES.REVIEWS, label: 'Reseñas', icon: Star },
  { href: ROUTES.PROFILE, label: 'Mi perfil', icon: User },
];

export function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">¿Necesitas ayuda?</p>
              <p className="text-xs text-muted-foreground">Disponible 24/7</p>
            </div>
          </div>
          <button className="w-full rounded-md border border-border px-3 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-background">
            Contactar soporte
          </button>
        </div>
      </div>
    </aside>
  );
}
