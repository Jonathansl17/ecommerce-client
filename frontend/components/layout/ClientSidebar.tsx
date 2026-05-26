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
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { SIDEBAR_NAV_LABELS, SIDEBAR_SUPPORT_STRINGS } from './layout.constants';

const PUBLIC_NAV_ITEMS = [
  { href: ROUTES.CATALOG, label: SIDEBAR_NAV_LABELS.catalog, icon: ShoppingBag },
];

const AUTHENTICATED_NAV_ITEMS = [
  { href: ROUTES.CART, label: SIDEBAR_NAV_LABELS.cart, icon: ShoppingCart },
  { href: ROUTES.ORDERS, label: SIDEBAR_NAV_LABELS.orders, icon: Package },
  { href: ROUTES.REVIEWS, label: SIDEBAR_NAV_LABELS.reviews, icon: Star },
  { href: ROUTES.PROFILE, label: SIDEBAR_NAV_LABELS.profile, icon: User },
];

export function ClientSidebar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const navItems = isAuthenticated
    ? [...PUBLIC_NAV_ITEMS, ...AUTHENTICATED_NAV_ITEMS]
    : PUBLIC_NAV_ITEMS;

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
              <p className="text-sm font-medium text-sidebar-foreground">{SIDEBAR_SUPPORT_STRINGS.title}</p>
              <p className="text-xs text-muted-foreground">{SIDEBAR_SUPPORT_STRINGS.availability}</p>
            </div>
          </div>
          <button className="w-full rounded-md border border-border px-3 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-background">
            {SIDEBAR_SUPPORT_STRINGS.button}
          </button>
        </div>
      </div>
    </aside>
  );
}
