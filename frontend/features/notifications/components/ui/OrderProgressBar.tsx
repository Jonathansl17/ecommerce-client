import { ORDER_STATUS_PROGRESS, getProgressIndex } from '../../utils/order-status-style.utils';
import type { OrderStatusNotificationStatus } from '../../types/order-status-notification.types';

interface OrderProgressBarProps {
  status: OrderStatusNotificationStatus;
}

export function OrderProgressBar({ status }: OrderProgressBarProps) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        Pedido cancelado
      </div>
    );
  }

  const currentIndex = getProgressIndex(status);
  const total = ORDER_STATUS_PROGRESS.length;

  return (
    <div className="flex items-center gap-0.5">
      {ORDER_STATUS_PROGRESS.map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i <= currentIndex ? 'bg-foreground' : 'bg-muted-foreground/20'
          }`}
        />
      ))}
      <span className="ml-2 shrink-0 text-[10px] text-muted-foreground">
        {currentIndex + 1}/{total}
      </span>
    </div>
  );
}
