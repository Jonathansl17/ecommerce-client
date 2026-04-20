import { NOTIFICATION_STRINGS } from '../../constants/notifications.constants';

export function PanelLoadingState() {
  return (
    <p
      role="status"
      aria-live="polite"
      className="px-4 py-6 text-center text-sm text-muted-foreground"
    >
      {NOTIFICATION_STRINGS.loading}
    </p>
  );
}
