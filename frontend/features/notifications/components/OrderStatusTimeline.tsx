'use client';

import { ArrowRight, AlertTriangle } from 'lucide-react';
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
      <ol className="divide-y divide-border">
        {historial.map((evento) => (
          <li key={evento.id} className="flex items-center gap-4 px-5 py-3 border-l-2 border-l-transparent hover:border-l-foreground/20 transition-colors">
            {/* Transition */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm text-muted-foreground">
                  {getPreviousStatusLabel(evento.previousStatus)}
                </span>
                <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
                <span className="text-sm font-semibold text-foreground">
                  {ORDER_STATUS_NOTIFICATION_STATUS_LABELS[evento.newStatus]}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatearFecha(evento.changedAt)}
              </p>
              {evento.deliveryStatus === 'failed' && (
                <div className="mt-1.5 flex items-start gap-1.5">
                  <AlertTriangle className="mt-px h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    {ORDER_STATUS_NOTIFICATION_STRINGS.externalDeliveryFailure}
                    {evento.deliveryLastError ? ` (${evento.deliveryLastError})` : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Badge */}
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_NOTIFICATION_DELIVERY_TONES[evento.deliveryStatus]}`}>
              {ORDER_STATUS_NOTIFICATION_DELIVERY_LABELS[evento.deliveryStatus]}
            </span>
          </li>
        ))}
      </ol>
    )
  );
}
