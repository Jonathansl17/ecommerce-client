import { NOTIFICATION_STRINGS } from '../../constants/notifications.constants';

export function PanelErrorState() {
  return (
    <p
      role="alert"
      aria-live="assertive"
      className="px-4 py-6 text-center text-sm text-destructive"
    >
      {NOTIFICATION_STRINGS.loadError}
    </p>
  );
}
