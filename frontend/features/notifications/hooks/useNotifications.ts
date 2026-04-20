'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchNotifications, markNotificationAsRead } from '../shared/notifications.api';
import { AUTH_STORAGE_KEYS } from '@/features/auth/constants/auth.constants';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';
import type { ClientNotification, UseNotificationsResult } from '../types/notifications.types';

export function useNotifications(): UseNotificationsResult {
  const [notificaciones, setNotificaciones] = useState<ClientNotification[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarNotificaciones = useCallback(async () => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    if (!token) {
      setError(null);
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

  const noLeidas = useMemo(
    () => notificaciones.filter((n) => !n.read).length,
    [notificaciones],
  );

  return { notificaciones, noLeidas, cargando, error, marcarComoLeida };
}
