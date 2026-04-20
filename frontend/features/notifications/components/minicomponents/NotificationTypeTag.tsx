import { NOTIFICATION_ENTITY_TYPES, NOTIFICATION_STRINGS } from '../../constants/notifications.constants';
import type { NotificationEntityType, NotificationTypeTagProps } from '../../types/notifications.types';

const TAG_STYLES: Record<NotificationEntityType, string> = {
  [NOTIFICATION_ENTITY_TYPES.ONBOARDING]: 'bg-blue-100 text-blue-700',
  [NOTIFICATION_ENTITY_TYPES.ORDER]: 'bg-amber-100 text-amber-700',
};

const TAG_LABELS: Record<NotificationEntityType, string> = {
  [NOTIFICATION_ENTITY_TYPES.ONBOARDING]: NOTIFICATION_STRINGS.welcomeTag,
  [NOTIFICATION_ENTITY_TYPES.ORDER]: NOTIFICATION_STRINGS.orderTag,
};

export function NotificationTypeTag({ entityType }: NotificationTypeTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TAG_STYLES[entityType]}`}
    >
      {TAG_LABELS[entityType]}
    </span>
  );
}
