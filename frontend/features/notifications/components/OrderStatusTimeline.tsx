'use client';

import {
  ORDER_STATUS_NOTIFICATION_DELIVERY_LABELS,
  ORDER_STATUS_NOTIFICATION_DELIVERY_TONES,
  ORDER_STATUS_NOTIFICATION_STATUS_LABELS,
  ORDER_STATUS_NOTIFICATION_STRINGS,
} from '../constants/order-status-notification.constants';
import { formatearFecha } from '../utils/formatDate';
import type {
  OrderStatusNotificationHistoryItem,
  OrderStatusTimelineProps,
} from '../types/order-status-notification.types';
import { OrderStatusTimelineEmptyState } from './ui/OrderStatusTimelineEmptyState';

function getPreviousStatusLabel(
  previousStatus: OrderStatusNotificationHistoryItem['previousStatus'],
) {
  if (previousStatus == null) {
    return ORDER_STATUS_NOTIFICATION_STRINGS.previousStatusEmpty;
  }

  return ORDER_STATUS_NOTIFICATION_STATUS_LABELS[previousStatus];
}

export function OrderStatusTimeline({ historial }: OrderStatusTimelineProps) {
  return (
    historial.length === 0 ? (
      <OrderStatusTimelineEmptyState />
    ) : (
      <ol className="space-y-4">
        {historial.map((evento) => (
          <li key={evento.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {ORDER_STATUS_NOTIFICATION_STRINGS.changedAt}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatearFecha(evento.changedAt)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${ORDER_STATUS_NOTIFICATION_DELIVERY_TONES[evento.deliveryStatus]}`}
              >
                {ORDER_STATUS_NOTIFICATION_DELIVERY_LABELS[evento.deliveryStatus]}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {ORDER_STATUS_NOTIFICATION_STRINGS.previousStatus}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {getPreviousStatusLabel(evento.previousStatus)}
                </p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {ORDER_STATUS_NOTIFICATION_STRINGS.newStatus}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {ORDER_STATUS_NOTIFICATION_STATUS_LABELS[evento.newStatus]}
                </p>
              </div>
            </div>

            {evento.deliveryStatus === 'failed' && (
              <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
                {ORDER_STATUS_NOTIFICATION_STRINGS.externalDeliveryFailure}
                {evento.deliveryLastError ? ` (${evento.deliveryLastError})` : ''}
              </p>
            )}
          </li>
        ))}
      </ol>
    )
  );
}
