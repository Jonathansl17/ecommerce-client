import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NOTIFICATION_STRINGS } from '../../constants/notifications.constants';
import { ROUTES } from '@/lib/constants/routes.constants';
import type { ViewOrderLinkProps } from '../../types/notifications.types';

export function ViewOrderLink({ orderId }: ViewOrderLinkProps) {
  return (
    <Link
      href={ROUTES.ORDER_DETAIL(orderId)}
      onClick={(e) => e.stopPropagation()}
      className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {NOTIFICATION_STRINGS.viewOrder}
      <ArrowRight className="h-3 w-3 opacity-50" />
    </Link>
  );
}
