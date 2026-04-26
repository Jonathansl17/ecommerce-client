import Link from 'next/link';
import { NOTIFICATION_STRINGS } from '../../constants/notifications.constants';
import { ROUTES } from '@/lib/constants/routes.constants';
import type { ViewOrderLinkProps } from '../../types/notifications.types';

export function ViewOrderLink({ orderId }: ViewOrderLinkProps) {
  return (
    <Link
      href={ROUTES.ORDER_DETAIL(orderId)}
      onClick={(e) => e.stopPropagation()}
      className="mt-2 inline-block rounded text-xs font-medium text-primary transition-colors hover:underline hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {NOTIFICATION_STRINGS.viewOrder}
    </Link>
  );
}
