import { NOTIFICATION_STRINGS } from '../../constants/notifications.constants';
import type { PanelHeaderProps } from '../../types/notifications.types';

export function PanelHeader({ unreadCount }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
      <h2 className="text-sm font-semibold text-foreground">
        {NOTIFICATION_STRINGS.panelTitle}
      </h2>
      {unreadCount > 0 && (
        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
          {NOTIFICATION_STRINGS.unreadCount(unreadCount)}
        </span>
      )}
    </div>
  );
}
