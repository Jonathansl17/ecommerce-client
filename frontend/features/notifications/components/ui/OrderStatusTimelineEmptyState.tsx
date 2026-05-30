'use client';

import { ORDER_STATUS_NOTIFICATION_STRINGS } from '../../constants/order-status-notification.constants';

export function OrderStatusTimelineEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
      {ORDER_STATUS_NOTIFICATION_STRINGS.timelineEmpty}
    </div>
  );
}
