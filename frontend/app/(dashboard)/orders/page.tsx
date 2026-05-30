'use client';

import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes.constants';
import {
  ORDER_STATUS_NOTIFICATION_STRINGS,
} from '@/features/notifications/constants/order-status-notification.constants';
import { useOrderStatusNotificationOrders } from '@/features/notifications/hooks/useOrderStatusNotificationOrders';
import { formatearFecha } from '@/features/notifications/utils/formatDate';
import { OrderStatusBadge } from '@/features/notifications/components/ui/OrderStatusBadge';
import { OrderProgressBar } from '@/features/notifications/components/ui/OrderProgressBar';
import { PAYMENT_STATUS_LABELS } from '@/features/notifications/utils/order-status-style.utils';

export default function OrdersPage() {
  const { pedidos, cargando, error } = useOrderStatusNotificationOrders();

  if (cargando) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 animate-shimmer space-y-4">
            <div className="h-5 w-1/3 rounded-md bg-muted" />
            <div className="h-3 w-full rounded-md bg-muted" />
            <div className="h-10 w-full rounded-md bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">
          {ORDER_STATUS_NOTIFICATION_STRINGS.ordersTitle}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {ORDER_STATUS_NOTIFICATION_STRINGS.ordersSubtitle}
        </p>
      </header>

      {pedidos.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 py-12 text-center">
          <Package className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {ORDER_STATUS_NOTIFICATION_STRINGS.emptyOrders}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <article key={pedido.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">

            {/* Header del card */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {ORDER_STATUS_NOTIFICATION_STRINGS.orderNumber(pedido.id)}
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  {formatearFecha(pedido.createdAt)}
                </p>
              </div>
              <OrderStatusBadge status={pedido.status} />
            </div>

            {/* Barra de progreso */}
            <div className="px-4 pb-3">
              <OrderProgressBar status={pedido.status} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
              <div className="px-4 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Total
                </p>
                <p className="text-sm font-bold text-foreground">
                  ₡{pedido.totalAmount.toLocaleString('es-CR')}
                </p>
              </div>
              <div className="px-4 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Artículos
                </p>
                <p className="text-sm font-bold text-foreground">
                  {pedido.orderItems.reduce((t, i) => t + i.quantity, 0)}
                </p>
              </div>
              <div className="px-4 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Pago
                </p>
                <p className="text-sm font-bold text-foreground">
                  {pedido.payments[0]?.status
                    ? PAYMENT_STATUS_LABELS[pedido.payments[0].status]
                    : '—'}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-border px-4 py-2.5">
              <Link
                href={ROUTES.ORDER_DETAIL(pedido.id)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
              >
                {ORDER_STATUS_NOTIFICATION_STRINGS.viewDetail}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </article>
        ))}
      </div>
    </div>
  );
}
