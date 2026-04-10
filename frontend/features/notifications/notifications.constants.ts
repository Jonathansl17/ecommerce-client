export const NOTIFICATION_ENTITY_TYPES = {
  ONBOARDING: 'onboarding',
  ORDER: 'order',
} as const;

export const NOTIFICATION_STRINGS = {
  bellAriaLabel: 'Notificaciones',
  panelTitle: 'Notificaciones',
  noNotifications: 'No tienes notificaciones',
  markAsRead: 'Marcar como leída',
  unreadBadgeAriaLabel: (count: number) => `${count} notificaciones sin leer`,
  unreadCount: (count: number) => `${count} sin leer`,
  welcomeTag: 'Bienvenida',
  orderTag: 'Pedido',
  viewOrder: 'Ver pedido →',
  loading: 'Cargando...',
  loadError: 'No se pudieron cargar las notificaciones',
  fetchError: 'Error al cargar notificaciones',
  markAsReadError: 'Error al marcar la notificación como leída',
} as const;

export const NOTIFICATION_BADGE = {
  MAX_COUNT: 9,
  OVERFLOW_LABEL: '9+',
} as const;

export const NOTIFICATION_DATE_FORMAT = {
  LOCALE: 'es-CR',
  OPTIONS: {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  },
} as const;
