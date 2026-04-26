'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { OrderStatusTimeline } from '@/features/notifications/components/OrderStatusTimeline';
import {
  ORDER_STATUS_NOTIFICATION_STATUS_LABELS,
  ORDER_STATUS_NOTIFICATION_STRINGS,
} from '@/features/notifications/constants/order-status-notification.constants';
import { useOrderStatusNotificationDetail } from '@/features/notifications/hooks/useOrderStatusNotificationDetail';
import { formatearFecha } from '@/features/notifications/utils/formatDate';

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = typeof params?.id === 'string' ? params.id : null;
  const { pedido, cargando, error } = useOrderStatusNotificationDetail(orderId);

  if (cargando) {
    return <p className="text-sm text-slate-600">{ORDER_STATUS_NOTIFICATION_STRINGS.loading}</p>;
  }

  if (error || !pedido) {
    return <p className="text-sm text-red-600">{error ?? ORDER_STATUS_NOTIFICATION_STRINGS.loadError}</p>;
  }

  return (
    <div className="space-y-6">
      <Link href="/orders" className="inline-flex text-sm font-semibold text-sky-700 hover:text-sky-800">
        {ORDER_STATUS_NOTIFICATION_STRINGS.backToOrders}
      </Link>

      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              {ORDER_STATUS_NOTIFICATION_STRINGS.orderNumber(pedido.id)}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {ORDER_STATUS_NOTIFICATION_STRINGS.orderDate}: {formatearFecha(pedido.createdAt)}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            {ORDER_STATUS_NOTIFICATION_STATUS_LABELS[pedido.status]}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              {ORDER_STATUS_NOTIFICATION_STRINGS.subtotal}
            </p>
            <p className="mt-2 text-lg font-bold text-slate-950">₡{pedido.subtotal.toLocaleString('es-CR')}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              {ORDER_STATUS_NOTIFICATION_STRINGS.taxes}
            </p>
            <p className="mt-2 text-lg font-bold text-slate-950">₡{pedido.taxes.toLocaleString('es-CR')}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              {ORDER_STATUS_NOTIFICATION_STRINGS.totalAmount}
            </p>
            <p className="mt-2 text-lg font-bold text-slate-950">
              ₡{pedido.totalAmount.toLocaleString('es-CR')}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {ORDER_STATUS_NOTIFICATION_STRINGS.shippingAddress}
          </p>
          <p className="mt-2 text-sm text-slate-700">{pedido.shippingAddress}</p>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          {ORDER_STATUS_NOTIFICATION_STRINGS.productsTitle}
        </h2>
        <div className="mt-4 space-y-4">
          {pedido.orderItems.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">
                    {item.variant?.product?.itemName ?? 'Producto del pedido'}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.variant?.color ?? 'Color N/D'} / {item.variant?.size ?? 'Talla N/D'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">
                    {ORDER_STATUS_NOTIFICATION_STRINGS.quantity}: {item.quantity}
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    ₡{item.unitPriceSnap.toLocaleString('es-CR')}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          {ORDER_STATUS_NOTIFICATION_STRINGS.timelineTitle}
        </h2>
        <div className="mt-4">
          <OrderStatusTimeline historial={pedido.orderStatusNotifications} />
        </div>
      </section>

      <p className="text-xs text-slate-500">
        {ORDER_STATUS_NOTIFICATION_STRINGS.missingIntegrationComment}
      </p>
    </div>
  );
}
