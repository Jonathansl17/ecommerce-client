'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications, markNotificationAsRead } from './notifications.api';
import { AUTH_STORAGE_KEYS } from '@/features/auth/constants/auth.constants';
import { NOTIFICATION_STRINGS } from './notifications.constants';
import type { ClientNotification } from './notifications.types';

interface UseNotificationsResult {
  notificaciones: ClientNotification[];
  noLeidas: number;
  cargando: boolean;
  error: string | null;
  marcarComoLeida: (id: string) => Promise<void>;
}

export function useNotifications(): UseNotificationsResult {
  const [notificaciones, setNotificaciones] = useState<ClientNotification[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarNotificaciones = useCallback(async () => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    if (!token) {
      setCargando(false);
      return;
    }

    try {
      setError(null);
      const respuesta = await fetchNotifications(token);
      setNotificaciones(respuesta.notificaciones);
    } catch {
      setError(NOTIFICATION_STRINGS.loadError);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  const marcarComoLeida = useCallback(async (id: string) => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    if (!token) return;

    try {
      const notificacionActualizada = await markNotificationAsRead(token, id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? notificacionActualizada : n))
      );
    } catch {
      // Error silencioso: no interrumpe la UX
    }
  }, []);

  const noLeidas = notificaciones.filter((n) => !n.read).length;

  return { notificaciones, noLeidas, cargando, error, marcarComoLeida };
}
