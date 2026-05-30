export const NOTIFICATION_ENTITY_TYPES = {
  ONBOARDING: 'onboarding',
  ORDER: 'order',
  PAYMENT: 'payment',
  PRODUCT_CUSTOMIZATION: 'product_customization',
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
  paymentTag: 'Pago',
  viewOrder: 'Ver pedido',
  customizationTag: 'Personalización',
  customizationImagesLabel: 'Fotografías del producto',
  customizationImageAlt: (index: number) => `Foto del producto personalizado ${index + 1}`,
  loading: 'Cargando...',
  loadError: 'No se pudieron cargar las notificaciones',
  fetchError: 'Error al cargar notificaciones',
  markAsReadError: 'Error al marcar la notificación como leída',
} as const;

export const PAYMENT_RECEIPT_STRINGS = {
  downloadLabel: 'Descargar comprobante',
  downloadingLabel: 'Generando...',
  downloadError: 'No se pudo descargar el comprobante',
  filename: (paymentId: string) => `comprobante-pago-${paymentId}.pdf`,
} as const;

export const NOTIFICATION_TAG_STYLES: Record<string, string> = {
  onboarding: 'border border-blue-500 text-blue-500 dark:border-blue-600 dark:text-blue-600',
  order: 'border border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500',
  payment: 'border border-indigo-500 text-indigo-500 dark:border-indigo-600 dark:text-indigo-600',
  product_customization: 'border border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500',
} as const;

export const NOTIFICATION_TAG_LABELS: Record<string, string> = {
  onboarding: NOTIFICATION_STRINGS.welcomeTag,
  order: NOTIFICATION_STRINGS.orderTag,
  payment: NOTIFICATION_STRINGS.paymentTag,
  product_customization: NOTIFICATION_STRINGS.customizationTag,
} as const;

export const NOTIFICATION_BADGE = {
  MAX_COUNT: 9,
  OVERFLOW_LABEL: '9+',
} as const;

export const NOTIFICATION_DATE_FORMAT: {
  LOCALE: string;
  OPTIONS: Intl.DateTimeFormatOptions;
} = {
  LOCALE: 'es-CR',
  OPTIONS: {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  },
};
