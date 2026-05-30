import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { API_BASE_URL } from '@/lib/constants/api.constants';
import { CSRF_HEADER_NAME, CSRF_HEADER_VALUE } from '@/lib/http/authRefresh';
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

export async function fetchPaymentReceiptBlob(paymentId: string): Promise<Blob> {
  const url = `${API_BASE_URL}/notifications/payments/${paymentId}/receipt`;
  const res = await fetch(url, {
    credentials: 'include',
    headers: { [CSRF_HEADER_NAME]: CSRF_HEADER_VALUE },
  });

  if (!res.ok) {
    throw new ApiError(res.status, await res.text().catch(() => null));
  }

  return res.blob();
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

export async function dismissNotification(notificationId: string): Promise<void> {
  try {
    await apiFetch(`/notifications/${notificationId}/dismiss`, { method: 'PATCH' });
  } catch {
    throw new Error(NOTIFICATION_STRINGS.dismissError);
  }
}
