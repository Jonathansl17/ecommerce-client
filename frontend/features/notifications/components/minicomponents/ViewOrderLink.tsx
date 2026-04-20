import Link from 'next/link';
import { NOTIFICATION_STRINGS } from '../../constants/notifications.constants';
import { ROUTES } from '@/lib/constants/routes.constants';
import type { ViewOrderLinkProps } from '../../types/notifications.types';

export function ViewOrderLink({ orderId }: ViewOrderLinkProps) {
  return (
    <Link
      href={ROUTES.ORDER_DETAIL(orderId)}
      onClick={(e) => e.stopPropagation()}
      className="mt-2 inline-block text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 rounded"
    >
      {NOTIFICATION_STRINGS.viewOrder}
    </Link>
  );
}
