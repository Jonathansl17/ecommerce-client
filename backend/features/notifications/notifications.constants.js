export const NOTIFICATION_MESSAGES = {
  NOT_FOUND: 'Notificación no encontrada',
  ALREADY_READ: 'La notificación ya estaba marcada como leída',
  MARKED_AS_READ: 'Notificación marcada como leída',
  EMAIL_UNKNOWN_ERROR: 'Error desconocido',
  EMAIL_RETRY_EXHAUSTED: 'Se agotaron los reintentos de envío',
  ORDER_CONFIRMED_TITLE: (orderId) => `Pedido #${orderId} confirmado`,
  ORDER_CONFIRMED_CONTENT: 'Tu compra fue procesada exitosamente. Haz clic para ver el detalle de tu pedido.',
};

export const NOTIFICATION_ENTITY_TYPES = {
  ONBOARDING: 'onboarding',
  ORDER: 'order',
};

export const NOTIFICATION_TYPES = {
  INTERNAL: 'internal',
  EMAIL: 'email',
  BOTH: 'both',
};

export const EMAIL_RETRY = {
  MAX_ATTEMPTS: 3,
  RETRY_BASE_DELAY_MS: 1000,
};

export const EMAIL_CONFIG = {
  SMTP_SECURE_PORT: 465,
  DELIVERY_ESTIMATE_DAYS: 7,
};
