'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { BellIcon } from './icons/BellIcon';
import { UnreadCountBadge } from './minicomponents/UnreadCountBadge';
import { PanelHeader } from './minicomponents/PanelHeader';
import { PanelLoadingState } from './minicomponents/PanelLoadingState';
import { PanelErrorState } from './minicomponents/PanelErrorState';
import { PanelEmptyState } from './minicomponents/PanelEmptyState';
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
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 hover:bg-foreground/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
      >
        <BellIcon />
        <UnreadCountBadge count={noLeidas} />
      </button>

      {abierto && (
        <div
          id={panelId}
          className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-foreground/10 bg-gray-900 shadow-lg"
        >
          <PanelHeader unreadCount={noLeidas} />

          {cargando && <PanelLoadingState />}
          {!cargando && error && <PanelErrorState />}
          {sinNotificaciones && <PanelEmptyState />}

          {hayNotificaciones && (
            <ul
              role="menu"
              aria-label={NOTIFICATION_STRINGS.bellAriaLabel}
              className="max-h-80 divide-y divide-foreground/10 overflow-y-auto"
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
