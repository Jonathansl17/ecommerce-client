'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { BellIcon } from './icons/BellIcon';
import { UnreadCountBadge } from './ui/UnreadCountBadge';
import { PanelHeader } from './ui/PanelHeader';
import { PanelLoadingState } from './ui/PanelLoadingState';
import { PanelErrorState } from './ui/PanelErrorState';
import { PanelEmptyState } from './ui/PanelEmptyState';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';

export function NotificationBell() {
  const [abierto, setAbierto] = useState(false);
  const { notificaciones, noLeidas, cargando, error, marcarComoLeida } = useNotifications();
  const contenedorRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    function handleClickFuera(e: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setAbierto(false);
    }

    document.addEventListener('mousedown', handleClickFuera, { passive: true });
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const hayNotificaciones = !cargando && !error && notificaciones.length > 0;
  const sinNotificaciones = !cargando && !error && notificaciones.length === 0;

  return (
    <div ref={contenedorRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        aria-label={
          noLeidas > 0
            ? NOTIFICATION_STRINGS.unreadBadgeAriaLabel(noLeidas)
            : NOTIFICATION_STRINGS.bellAriaLabel
        }
        aria-expanded={abierto}
        aria-haspopup="menu"
        aria-controls={panelId}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <BellIcon />
        <UnreadCountBadge count={noLeidas} />
      </button>

      {abierto && (
        <div
          id={panelId}
          className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-lg"
        >
          <PanelHeader unreadCount={noLeidas} />

          {cargando && <PanelLoadingState />}
          {!cargando && error && <PanelErrorState />}
          {sinNotificaciones && <PanelEmptyState />}

          {hayNotificaciones && (
            <ul
              role="menu"
              aria-label={NOTIFICATION_STRINGS.bellAriaLabel}
              className="max-h-80 divide-y divide-border overflow-y-auto"
            >
              {notificaciones.map((notificacion) => (
                <NotificationItem
                  key={notificacion.id}
                  notification={notificacion}
                  onRead={marcarComoLeida}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
