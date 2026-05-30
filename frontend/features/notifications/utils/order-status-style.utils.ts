import type { OrderStatusNotificationStatus, OrderPaymentStatus } from '../types/order-status-notification.types';

export const ORDER_STATUS_PROGRESS = [
  'pending_payment',
  'confirmed',
  'in_preparation',
  'customization_in_progress',
  'ready_shipment',
  'shipped',
  'in_transit',
  'delivered',
] as const satisfies readonly OrderStatusNotificationStatus[];

export const ORDER_STATUS_BADGE_STYLES: Record<OrderStatusNotificationStatus, string> = {
  pending_payment:           'border border-amber-500 text-amber-600',
  confirmed:                 'border border-blue-500 text-blue-600',
  in_preparation:            'border border-blue-500 text-blue-600',
  customization_in_progress: 'border border-blue-500 text-blue-600',
  ready_shipment:            'border border-indigo-500 text-indigo-600',
  shipped:                   'border border-indigo-500 text-indigo-600',
  in_transit:                'border border-indigo-500 text-indigo-600',
  delivered:                 'border border-emerald-600 text-emerald-600',
  cancelled:                 'border border-zinc-400 text-zinc-500',
};

export const PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  pending:  'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  voided:   'Anulado',
};

export function getProgressIndex(status: OrderStatusNotificationStatus): number {
  return ORDER_STATUS_PROGRESS.indexOf(status as typeof ORDER_STATUS_PROGRESS[number]);
}
