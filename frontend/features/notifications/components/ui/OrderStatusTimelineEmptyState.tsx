'use client';

import { ORDER_STATUS_NOTIFICATION_STRINGS } from '../../constants/order-status-notification.constants';

export function OrderStatusTimelineEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
      {ORDER_STATUS_NOTIFICATION_STRINGS.timelineEmpty}
    </div>
  );
}
