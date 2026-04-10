'use client';

import Link from 'next/link';
import { NOTIFICATION_DATE_FORMAT, NOTIFICATION_ENTITY_TYPES, NOTIFICATION_STRINGS } from './notifications.constants';
import { ROUTES } from '@/lib/constants/routes.constants';
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
  const esPedido = notification.entityType === NOTIFICATION_ENTITY_TYPES.ORDER;
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
        'px-4 py-3 cursor-pointer select-none animate-tap',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20',
        notification.read ? 'hover:bg-gray-800' : 'bg-gray-800 hover:bg-gray-700',
        esBienvenida ? 'border-l-4 border-foreground/30' : '',
        esPedido ? 'border-l-4 border-amber-500/60' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground truncate">
              {notification.title}
            </p>
            {esBienvenida && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                {NOTIFICATION_STRINGS.welcomeTag}
              </span>
            )}
            {esPedido && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                {NOTIFICATION_STRINGS.orderTag}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-foreground/70 line-clamp-2">{notification.content}</p>
          <p className="mt-1 text-xs text-foreground/50">{formatearFecha(fecha)}</p>
          {esPedido && notification.entityId != null && (
            <Link
              href={ROUTES.ORDER_DETAIL(notification.entityId)}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 inline-block text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 rounded"
            >
              {NOTIFICATION_STRINGS.viewOrder}
            </Link>
          )}
        </div>
        {!notification.read && (
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-foreground/50 animate-pulse" aria-hidden="true" />
        )}
      </div>
    </li>
  );
}
