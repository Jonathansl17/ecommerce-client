import { NOTIFICATION_ENTITY_TYPES, NOTIFICATION_STRINGS } from '../../constants/notifications.constants';
import type { NotificationEntityType, NotificationTypeTagProps } from '../../types/notifications.types';

const TAG_STYLES: Record<NotificationEntityType, string> = {
  [NOTIFICATION_ENTITY_TYPES.ONBOARDING]: 'bg-sky-400 text-white dark:bg-sky-500',
  [NOTIFICATION_ENTITY_TYPES.ORDER]: 'bg-secondary text-secondary-foreground',
  [NOTIFICATION_ENTITY_TYPES.PAYMENT]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
};

const TAG_LABELS: Record<NotificationEntityType, string> = {
  [NOTIFICATION_ENTITY_TYPES.ONBOARDING]: NOTIFICATION_STRINGS.welcomeTag,
  [NOTIFICATION_ENTITY_TYPES.ORDER]: NOTIFICATION_STRINGS.orderTag,
  [NOTIFICATION_ENTITY_TYPES.PAYMENT]: NOTIFICATION_STRINGS.paymentTag,
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
