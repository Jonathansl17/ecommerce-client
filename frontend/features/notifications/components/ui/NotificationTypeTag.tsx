import {
  NOTIFICATION_TAG_LABELS,
  NOTIFICATION_TAG_STYLES,
} from '../../constants/notifications.constants';
import type { NotificationTypeTagProps } from '../../types/notifications.types';

export function NotificationTypeTag({ entityType }: NotificationTypeTagProps) {
  const style = NOTIFICATION_TAG_STYLES[entityType] ?? '';
  const label = NOTIFICATION_TAG_LABELS[entityType] ?? entityType;

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
