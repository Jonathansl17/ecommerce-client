import { NOTIFICATION_BADGE } from '../../constants/notifications.constants';
import type { UnreadCountBadgeProps } from '../../types/notifications.types';

export function UnreadCountBadge({ count }: UnreadCountBadgeProps) {
  if (count <= 0) return null;

  const label =
    count > NOTIFICATION_BADGE.MAX_COUNT ? NOTIFICATION_BADGE.OVERFLOW_LABEL : count;

  return (
    <span
      aria-hidden="true"
      className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-white"
    >
      {label}
    </span>
  );
}
