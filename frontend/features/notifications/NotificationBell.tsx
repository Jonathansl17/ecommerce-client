'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from './useNotifications';
import { NotificationItem } from './NotificationItem';
import { NOTIFICATION_BADGE, NOTIFICATION_STRINGS } from './notifications.constants';

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function NotificationBell() {
  const [abierto, setAbierto] = useState(false);
  const { notificaciones, noLeidas, cargando, error, marcarComoLeida } = useNotifications();
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickFuera(e: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setAbierto(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

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
        aria-haspopup="listbox"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
      >
        <BellIcon />
        {noLeidas > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none"
          >
            {noLeidas > NOTIFICATION_BADGE.MAX_COUNT ? NOTIFICATION_BADGE.OVERFLOW_LABEL : noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-label={NOTIFICATION_STRINGS.bellAriaLabel}
          className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {NOTIFICATION_STRINGS.panelTitle}
            </h2>
            {noLeidas > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                {NOTIFICATION_STRINGS.unreadCount(noLeidas)}
              </span>
            )}
          </div>

          {cargando && (
            <p className="px-4 py-6 text-center text-sm text-gray-500">{NOTIFICATION_STRINGS.loading}</p>
          )}

          {!cargando && error && (
            <p role="alert" className="px-4 py-6 text-center text-sm text-red-600">
              {NOTIFICATION_STRINGS.loadError}
            </p>
          )}

          {!cargando && !error && notificaciones.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-500">
              {NOTIFICATION_STRINGS.noNotifications}
            </p>
          )}

          {!cargando && !error && notificaciones.length > 0 && (
            <ul
              role="listbox"
              aria-label={NOTIFICATION_STRINGS.bellAriaLabel}
              className="max-h-80 divide-y divide-gray-100 overflow-y-auto"
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
