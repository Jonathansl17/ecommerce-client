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
  viewOrder: 'Ver pedido →',
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
  onboarding: 'bg-sky-400 text-white dark:bg-sky-500',
  order: 'bg-secondary text-secondary-foreground',
  payment: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  product_customization: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
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
