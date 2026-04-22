export const NOTIFICATION_MESSAGES = {
  NOT_FOUND: 'Notificación no encontrada',
  ALREADY_READ: 'La notificación ya estaba marcada como leída',
  MARKED_AS_READ: 'Notificación marcada como leída',
  EMAIL_UNKNOWN_ERROR: 'Error desconocido',
  EMAIL_RETRY_EXHAUSTED: 'Se agotaron los reintentos de envío',
  ORDER_CONFIRMED_TITLE: (orderId) => `Pedido #${orderId} confirmado`,
  ORDER_CONFIRMED_CONTENT: 'Tu compra fue procesada exitosamente. Haz clic para ver el detalle de tu pedido.',
  EMAIL_CONFIGURATION_MISSING: (configKey) =>
    `Falta la configuración de correo requerida: ${configKey}`,
  EMAIL_RECIPIENT_REQUIRED: 'El correo del destinatario es obligatorio',
  EMAIL_SUBJECT_REQUIRED: 'El asunto del correo es obligatorio',
  EMAIL_HTML_REQUIRED: 'El contenido HTML del correo es obligatorio',
  EMAIL_ORDER_DATA_REQUIRED: 'La orden es requerida para enviar notificaciones por correo',
  EMAIL_CLIENT_DATA_REQUIRED:
    'Los datos del cliente son requeridos para enviar notificaciones por correo',
  EMAIL_ORDER_ID_REQUIRED:
    'El id de la orden es requerido para enviar notificaciones por correo',
  EMAIL_CLIENT_EMAIL_REQUIRED:
    'El email del cliente es requerido para enviar notificaciones por correo',
  EMAIL_TEMPLATE_CHANGED_AT_REQUIRED:
    'La fecha/hora del cambio es requerida para construir la plantilla de notificación',
  EMAIL_TEMPLATE_NEW_STATUS_REQUIRED:
    'El nuevo estado es requerido para construir la plantilla de notificación',
  ORDER_CONFIRMATION_EMAIL_SUBJECT: (orderId, brandName) =>
    `Confirmación de tu pedido #${orderId} — ${brandName}`,
  ORDER_STATUS_NOTIFICATION_NOT_FOUND: 'No se encontró el historial de notificación del cambio de estado',
  ORDER_STATUS_NOTIFICATION_TRIGGER_COMMENT:
    'TODO(order_status_notification): connect this status mutation to the future admin/backoffice workflow once that module exists.',
  ORDER_STATUS_UPDATED_TITLE: (orderId, statusLabel) =>
    `Pedido #${orderId} actualizado a ${statusLabel}`,
  ORDER_STATUS_UPDATED_CONTENT: ({ previousStatusLabel, newStatusLabel, changedAtLabel }) =>
    `Estado anterior: ${previousStatusLabel}. Estado nuevo: ${newStatusLabel}. Fecha/hora del cambio: ${changedAtLabel}.`,
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
  MAX_DELIVERY_WINDOW_MS: 2 * 60 * 1000,
};

export const EMAIL_CONFIG = {
  BRAND_NAME: 'Mi Tienda',
  SMTP_SECURE_PORT: 465,
  DELIVERY_ESTIMATE_DAYS: 7,
  REQUIRED_ENV_VARS: ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'],
};

export const ORDER_STATUS_NOTIFICATION_DELIVERY_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
};

export const ORDER_STATUS_NOTIFICATION_STATUS_LABELS = {
  pending_payment: 'Pago pendiente',
  confirmed: 'Confirmado',
  in_preparation: 'En preparación',
  customization_in_progress: 'Personalización en proceso',
  ready_shipment: 'Listo para envío',
  shipped: 'Enviado',
  in_transit: 'En tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};
