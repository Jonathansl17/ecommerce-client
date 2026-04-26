'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes.constants';
import { OrderStatusTimeline } from '@/features/notifications/components/OrderStatusTimeline';
import {
  ORDER_STATUS_NOTIFICATION_STATUS_LABELS,
  ORDER_STATUS_NOTIFICATION_STRINGS,
} from '@/features/notifications/constants/order-status-notification.constants';
import { useOrderStatusNotificationOrders } from '@/features/notifications/hooks/useOrderStatusNotificationOrders';
import { formatearFecha } from '@/features/notifications/utils/formatDate';

export default function OrdersPage() {
  const { pedidos, cargando, error } = useOrderStatusNotificationOrders();

  if (cargando) {
    return <p className="text-sm text-slate-600">{ORDER_STATUS_NOTIFICATION_STRINGS.loading}</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-950">
          {ORDER_STATUS_NOTIFICATION_STRINGS.ordersTitle}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          {ORDER_STATUS_NOTIFICATION_STRINGS.ordersSubtitle}
        </p>
      </header>

      {pedidos.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
          {ORDER_STATUS_NOTIFICATION_STRINGS.emptyOrders}
        </div>
      )}

      <div className="space-y-6">
        {pedidos.map((pedido) => (
          <article key={pedido.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  {ORDER_STATUS_NOTIFICATION_STRINGS.orderNumber(pedido.id)}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {ORDER_STATUS_NOTIFICATION_STRINGS.orderDate}: {formatearFecha(pedido.createdAt)}
                </p>
              </div>

              <div className="flex flex-col items-start gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {ORDER_STATUS_NOTIFICATION_STRINGS.currentStatus}:{' '}
                  {ORDER_STATUS_NOTIFICATION_STATUS_LABELS[pedido.status]}
                </span>
                <Link
                  href={ROUTES.ORDER_DETAIL(pedido.id)}
                  className="text-sm font-semibold text-sky-700 hover:text-sky-800"
                >
                  {ORDER_STATUS_NOTIFICATION_STRINGS.viewDetail}
                </Link>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {ORDER_STATUS_NOTIFICATION_STRINGS.totalAmount}
                </p>
                <p className="mt-2 text-lg font-bold text-slate-950">
                  ₡{pedido.totalAmount.toLocaleString('es-CR')}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {ORDER_STATUS_NOTIFICATION_STRINGS.productsTitle}
                </p>
                <p className="mt-2 text-lg font-bold text-slate-950">
                  {pedido.orderItems.reduce((total, item) => total + item.quantity, 0)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {ORDER_STATUS_NOTIFICATION_STRINGS.paymentTitle}
                </p>
                <p className="mt-2 text-lg font-bold text-slate-950">
                  {pedido.payments[0]?.status ?? 'Sin pago registrado'}
                </p>
              </div>
            </div>

            <section className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                {ORDER_STATUS_NOTIFICATION_STRINGS.timelineTitle}
              </h3>
              <div className="mt-3">
                <OrderStatusTimeline historial={pedido.orderStatusNotifications} />
              </div>
            </section>
          </article>
        ))}
      </div>
    </div>
  );
}
