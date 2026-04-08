'use client';

import { NOTIFICATION_DATE_FORMAT, NOTIFICATION_ENTITY_TYPES, NOTIFICATION_STRINGS } from './notifications.constants';
import type { ClientNotification } from './notifications.types';

function formatearFecha(fechaIso: string): string {
  return new Date(fechaIso).toLocaleDateString(
    NOTIFICATION_DATE_FORMAT.LOCALE,
    NOTIFICATION_DATE_FORMAT.OPTIONS as Intl.DateTimeFormatOptions,
  );
}

interface NotificationItemProps {
  notification: ClientNotification;
  onRead: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const esBienvenida = notification.entityType === NOTIFICATION_ENTITY_TYPES.ONBOARDING;
  const fecha = notification.sentAt ?? notification.createdAt;

  function handleClick() {
    if (!notification.read) onRead(notification.id);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <li
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={
        notification.read
          ? notification.title
          : `${NOTIFICATION_STRINGS.markAsRead}: ${notification.title}`
      }
      className={[
        'px-4 py-3 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300',
        notification.read ? 'hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100',
        esBienvenida ? 'border-l-4 border-blue-500' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {notification.title}
            </p>
            {esBienvenida && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                {NOTIFICATION_STRINGS.welcomeTag}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-gray-600 line-clamp-2">{notification.content}</p>
          <p className="mt-1 text-xs text-gray-500">{formatearFecha(fecha)}</p>
        </div>
        {!notification.read && (
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
        )}
      </div>
    </li>
  );
}
