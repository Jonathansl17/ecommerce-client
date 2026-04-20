import { NOTIFICATION_BADGE } from '../../constants/notifications.constants';
import type { UnreadCountBadgeProps } from '../../types/notifications.types';

export function UnreadCountBadge({ count }: UnreadCountBadgeProps) {
  if (count <= 0) return null;

  const label =
    count > NOTIFICATION_BADGE.MAX_COUNT ? NOTIFICATION_BADGE.OVERFLOW_LABEL : count;

  return (
    <span
      aria-hidden="true"
      className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none"
    >
      {label}
    </span>
  );
}
