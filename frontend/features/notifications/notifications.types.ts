export interface ClientNotification {
  id: string;
  title: string;
  content: string;
  entityType: string;
  read: boolean;
  sentAt: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  notificaciones: ClientNotification[];
}
