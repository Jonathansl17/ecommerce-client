'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { OrderStatusTimeline } from '@/features/notifications/components/OrderStatusTimeline';
import { OrderStatusStepper } from '@/features/notifications/components/ui/OrderStatusStepper';
import { OrderStatusBadge } from '@/features/notifications/components/ui/OrderStatusBadge';
import {
  ORDER_STATUS_NOTIFICATION_STRINGS,
} from '@/features/notifications/constants/order-status-notification.constants';
import { PAYMENT_STATUS_LABELS } from '@/features/notifications/utils/order-status-style.utils';
import { useOrderStatusNotificationDetail } from '@/features/notifications/hooks/useOrderStatusNotificationDetail';
import { formatearFecha } from '@/features/notifications/utils/formatDate';
import { CancelOrderButton } from '@/features/orders/components/CancelOrderButton';
import { ROUTES } from '@/lib/constants/routes.constants';

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  SINPE: 'SINPE Móvil',
  cash:  'Efectivo',
  card:  'Tarjeta',
  other: 'Otro',
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = typeof params?.id === 'string' ? params.id : null;
  const { pedido, cargando, error } = useOrderStatusNotificationDetail(orderId);

  if (cargando) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 animate-shimmer space-y-3">
            <div className="h-5 w-1/3 rounded-md bg-muted" />
            <div className="h-3 w-2/3 rounded-md bg-muted" />
            <div className="h-12 w-full rounded-md bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !pedido) {
    return <p className="text-sm text-destructive">{error ?? ORDER_STATUS_NOTIFICATION_STRINGS.loadError}</p>;
  }

  const payment = pedido.payments[0] ?? null;

  return (
    <div className="space-y-5">

      {/* Back link */}
      <Link
        href={ROUTES.ORDERS}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {ORDER_STATUS_NOTIFICATION_STRINGS.backToOrders}
      </Link>

      {/* Header */}
      <header className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {ORDER_STATUS_NOTIFICATION_STRINGS.orderNumber(pedido.id)}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {ORDER_STATUS_NOTIFICATION_STRINGS.orderDate}: {formatearFecha(pedido.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <OrderStatusBadge status={pedido.status} />
            <CancelOrderButton
              orderId={pedido.id}
              currentStatus={pedido.status}
              onCancelled={() => router.refresh()}
            />
          </div>
        </div>
      </header>

      {/* Stepper */}
      <OrderStatusStepper status={pedido.status} />

      {/* Financial summary */}
      <section className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {ORDER_STATUS_NOTIFICATION_STRINGS.subtotal}
          </p>
          <p className="mt-1 text-base font-bold text-foreground">
            ₡{pedido.subtotal.toLocaleString('es-CR')}
          </p>
        </div>
        <div className="px-4 py-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {ORDER_STATUS_NOTIFICATION_STRINGS.taxes}
          </p>
          <p className="mt-1 text-base font-bold text-foreground">
            ₡{pedido.taxes.toLocaleString('es-CR')}
          </p>
        </div>
        <div className="px-4 py-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {ORDER_STATUS_NOTIFICATION_STRINGS.totalAmount}
          </p>
          <p className="mt-1 text-base font-bold text-foreground">
            ₡{pedido.totalAmount.toLocaleString('es-CR')}
          </p>
        </div>
      </section>

      {/* Shipping address */}
      <div className="rounded-xl border border-border bg-card px-5 py-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {ORDER_STATUS_NOTIFICATION_STRINGS.shippingAddress}
        </p>
        <p className="mt-1 text-sm text-foreground">{pedido.shippingAddress}</p>
      </div>

      {/* Payment */}
      {payment && (
        <section className="rounded-xl border border-border bg-card px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">
            {ORDER_STATUS_NOTIFICATION_STRINGS.paymentTitle}
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Método</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Monto</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                ₡{payment.amount.toLocaleString('es-CR')}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Estado</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {PAYMENT_STATUS_LABELS[payment.status] ?? payment.status}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">
            {ORDER_STATUS_NOTIFICATION_STRINGS.productsTitle}
          </h2>
        </div>
        <div className="divide-y divide-border">
          {pedido.orderItems.map((item) => (
            <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {item.variant?.product?.itemName ?? 'Producto del pedido'}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.variant?.color ?? 'Color N/D'} · {item.variant?.size ?? 'Talla N/D'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {ORDER_STATUS_NOTIFICATION_STRINGS.quantity}: {item.quantity}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  ₡{item.unitPriceSnap.toLocaleString('es-CR')}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Status history */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">
            {ORDER_STATUS_NOTIFICATION_STRINGS.timelineTitle}
          </h2>
        </div>
        <div className="p-4">
          <OrderStatusTimeline historial={pedido.orderStatusNotifications} />
        </div>
      </section>

    </div>
  );
}
