import { apiFetch } from '@/lib/http/apiFetch';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';
import type { ClientNotification, NotificationsResponse } from '../types/notifications.types';

export async function fetchNotifications(
  options?: { unread?: boolean }
): Promise<NotificationsResponse> {
  const params = options?.unread ? '?unread=true' : '';
  try {
    return await apiFetch<NotificationsResponse>(`/notifications${params}`);
  } catch {
    throw new Error(NOTIFICATION_STRINGS.fetchError);
  }
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<ClientNotification> {
  try {
    const body = await apiFetch<{ notificacion: ClientNotification }>(
      `/notifications/${notificationId}/read`,
      { method: 'PATCH' }
    );
    return body.notificacion;
  } catch {
    throw new Error(NOTIFICATION_STRINGS.markAsReadError);
  }
}
