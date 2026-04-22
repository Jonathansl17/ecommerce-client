import type { NOTIFICATION_ENTITY_TYPES } from '../constants/notifications.constants';

export type NotificationEntityType =
  (typeof NOTIFICATION_ENTITY_TYPES)[keyof typeof NOTIFICATION_ENTITY_TYPES];

export type NotificationType = 'internal' | 'email' | 'both';

export interface ClientNotification {
  id: string;
  clientUserId: string;
  type: NotificationType;
  title: string;
  content: string;
  entityType: NotificationEntityType;
  entityId?: string | null;
  read: boolean;
  sentAt: string | null;
  sendAttempts: number;
  createdAt: string;
}

export interface NotificationsResponse {
  notificaciones: ClientNotification[];
}

export interface UseNotificationsResult {
  notificaciones: ClientNotification[];
  noLeidas: number;
  cargando: boolean;
  error: string | null;
  marcarComoLeida: (id: string) => Promise<void>;
}

export interface NotificationItemProps {
  notification: ClientNotification;
  onRead: (id: string) => void;
}

export interface UnreadCountBadgeProps {
  count: number;
}

export interface PanelHeaderProps {
  unreadCount: number;
}

export interface NotificationTypeTagProps {
  entityType: NotificationEntityType;
}

export interface ViewOrderLinkProps {
  orderId: string;
}
