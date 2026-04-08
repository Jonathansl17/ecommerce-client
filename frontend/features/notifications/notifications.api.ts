import { API_BASE_URL } from '@/lib/constants/api.constants';
import { NOTIFICATION_STRINGS } from './notifications.constants';
import type { ClientNotification, NotificationsResponse } from './notifications.types';

function getAuthHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchNotifications(
  token: string,
  options?: { unread?: boolean }
): Promise<NotificationsResponse> {
  const params = options?.unread ? '?unread=true' : '';
  const res = await fetch(`${API_BASE_URL}/notifications${params}`, {
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    throw new Error(NOTIFICATION_STRINGS.fetchError);
  }

  return res.json();
}

export async function markNotificationAsRead(
  token: string,
  notificationId: string
): Promise<ClientNotification> {
  const res = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    throw new Error(NOTIFICATION_STRINGS.markAsReadError);
  }

  const body = await res.json();
  return body.notificacion as ClientNotification;
}
