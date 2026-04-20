import { NOTIFICATION_STRINGS } from '../../constants/notifications.constants';

export function PanelEmptyState() {
  return (
    <p className="px-4 py-6 text-center text-sm text-foreground/50">
      {NOTIFICATION_STRINGS.noNotifications}
    </p>
  );
}
