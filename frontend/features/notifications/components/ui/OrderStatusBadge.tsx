import { ORDER_STATUS_NOTIFICATION_STATUS_LABELS } from '../../constants/order-status-notification.constants';
import { ORDER_STATUS_BADGE_STYLES } from '../../utils/order-status-style.utils';
import type { OrderStatusNotificationStatus } from '../../types/order-status-notification.types';

interface OrderStatusBadgeProps {
  status: OrderStatusNotificationStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const style = ORDER_STATUS_BADGE_STYLES[status] ?? 'bg-zinc-100 text-zinc-500 border border-zinc-200';
  const label = ORDER_STATUS_NOTIFICATION_STATUS_LABELS[status] ?? status;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}
