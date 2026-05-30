import { BellOff } from 'lucide-react';
import { NOTIFICATION_STRINGS } from '../../constants/notifications.constants';

export function PanelEmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-8">
      <BellOff className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">
        {NOTIFICATION_STRINGS.noNotifications}
      </p>
    </div>
  );
}
