'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchNotifications, markNotificationAsRead } from '../shared/notifications.api';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';
import type { ClientNotification, UseNotificationsResult } from '../types/notifications.types';

export function useNotifications(): UseNotificationsResult {
  const { isAuthenticated } = useAuth();
  const [notificaciones, setNotificaciones] = useState<ClientNotification[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarNotificaciones = useCallback(async () => {
    if (!isAuthenticated) {
      setError(null);
      setCargando(false);
      return;
    }

    try {
      setError(null);
      const respuesta = await fetchNotifications();
      setNotificaciones(respuesta.notificaciones);
    } catch {
      setError(NOTIFICATION_STRINGS.loadError);
    } finally {
      setCargando(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  const marcarComoLeida = useCallback(async (id: string) => {
    if (!isAuthenticated) return;

    try {
      const notificacionActualizada = await markNotificationAsRead(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? notificacionActualizada : n))
      );
    } catch {
      // Error silencioso: no interrumpe la UX
    }
  }, [isAuthenticated]);

  const noLeidas = useMemo(
    () => notificaciones.filter((n) => !n.read).length,
    [notificaciones],
  );

  return { notificaciones, noLeidas, cargando, error, marcarComoLeida };
}
