'use client';

import { useState, useRef, useEffect, useId, useCallback } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { BellIcon } from './icons/BellIcon';
import { UnreadCountBadge } from './ui/UnreadCountBadge';
import { PanelHeader } from './ui/PanelHeader';
import { PanelLoadingState } from './ui/PanelLoadingState';
import { PanelErrorState } from './ui/PanelErrorState';
import { PanelEmptyState } from './ui/PanelEmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';

const ITEMS_PER_PAGE = 5;

export function NotificationBell() {
  const [abierto, setAbierto] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [pagina, setPagina] = useState(1);
  const { notificaciones, noLeidas, cargando, error, marcarComoLeida, descartarNotificacion } = useNotifications();
  const contenedorRef = useRef<HTMLDivElement>(null);
  const ringTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();

  const totalPaginas = Math.max(1, Math.ceil(notificaciones.length / ITEMS_PER_PAGE));

  // Mantener la página dentro de rango cuando cambia la lista (p. ej. al descartar).
  useEffect(() => {
    if (pagina > totalPaginas) setPagina(totalPaginas);
  }, [pagina, totalPaginas]);

  const notificacionesPagina = notificaciones.slice(
    (pagina - 1) * ITEMS_PER_PAGE,
    pagina * ITEMS_PER_PAGE,
  );

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

  useEffect(() => {
    return () => {
      if (ringTimerRef.current != null) clearTimeout(ringTimerRef.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    setAbierto((prev) => !prev);
    setRinging(true);
    if (ringTimerRef.current != null) clearTimeout(ringTimerRef.current);
    ringTimerRef.current = setTimeout(() => setRinging(false), 700);
  }, []);

  const hayNotificaciones = !cargando && !error && notificaciones.length > 0;
  const sinNotificaciones = !cargando && !error && notificaciones.length === 0;

  return (
    <div ref={contenedorRef} className="relative">
      <button
        type="button"
        onClick={handleClick}
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
        <BellIcon ringing={ringing} />
        <UnreadCountBadge count={noLeidas} />
      </button>

      {abierto && (
        <div
          id={panelId}
          className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-lg animate-notif-panel-in"
        >
          <PanelHeader unreadCount={noLeidas} />

          {cargando && <PanelLoadingState />}
          {!cargando && error && <PanelErrorState />}
          {sinNotificaciones && <PanelEmptyState />}

          {hayNotificaciones && (
            <>
              <ul
                role="menu"
                aria-label={NOTIFICATION_STRINGS.bellAriaLabel}
                className="max-h-80 divide-y divide-zinc-300 dark:divide-zinc-600 overflow-y-auto"
              >
                {notificacionesPagina.map((notificacion) => (
                  <NotificationItem
                    key={notificacion.id}
                    notification={notificacion}
                    onRead={marcarComoLeida}
                    onDismiss={descartarNotificacion}
                  />
                ))}
              </ul>
              {notificaciones.length > ITEMS_PER_PAGE && (
                <div className="border-t border-border px-3 py-2">
                  <Pagination
                    page={pagina}
                    limit={ITEMS_PER_PAGE}
                    total={notificaciones.length}
                    itemLabelSingular="notificación"
                    itemLabelPlural="notificaciones"
                    onPageChange={setPagina}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
