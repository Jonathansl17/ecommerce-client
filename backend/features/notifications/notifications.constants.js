export const NOTIFICATION_MESSAGES = {
  NOT_FOUND: 'Notificación no encontrada',
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
  PAYMENT: 'payment',
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

export const PAYMENT_NOTIFICATION = {
  TRIGGER_DEADLINE_MS: 15 * 1000,
};

export const PAYMENT_NOTIFICATION_MESSAGES = {
  APPROVED_TITLE: (orderId) => `Pago aprobado — Pedido #${orderId}`,
  APPROVED_CONTENT: ({ amount, method, reference, chargedAt }) =>
    `Monto cobrado: ${amount}. Método: ${method}. Referencia: ${reference}. Fecha del cargo: ${chargedAt}.`,
  EMAIL_PAYMENT_DATA_REQUIRED: 'Los datos del pago son requeridos para enviar la notificación',
  EMAIL_PAYMENT_ID_REQUIRED: 'El id del pago es requerido para la notificación de pago aprobado',
  EMAIL_PAYMENT_AMOUNT_REQUIRED: 'El monto del pago es requerido para la notificación de pago aprobado',
  EMAIL_SUBJECT: (orderId, brandName) => `Pago aprobado — Pedido #${orderId} | ${brandName}`,
  TIMEOUT_ERROR: 'Timeout de notificación de pago excedido',
};

export const PAYMENT_NOTIFICATION_LOG_PREFIXES = {
  EMAIL_FAILURE: '[PAYMENT_EMAIL_FAILURE] Fallo permanente al enviar correo de pago aprobado.',
  EMAIL_RETRY_WARN: '[PAYMENT_EMAIL_RETRY] No se pudo actualizar sendAttempts en DB.',
  EMAIL_RETRY_ATTEMPT: (intentos, max, paymentId) =>
    `[PAYMENT_EMAIL_RETRY] Intento ${intentos}/${max} fallido para pago #${paymentId}.`,
  TRIGGER_ERROR: '[PAYMENT_NOTIF_TRIGGER] Error al procesar notificación de pago aprobado.',
};

export const PAYMENT_METHOD_LABELS = {
  SINPE: 'SINPE Móvil',
  cash: 'Efectivo',
  card: 'Tarjeta',
  other: 'Otro',
};

export const PAYMENT_RECEIPT_PDF = {
  MIME_TYPE: 'application/pdf',
  FILENAME: (orderId) => `comprobante-pago-pedido-${orderId}.pdf`,
  CONTENT_DISPOSITION: (filename) => `attachment; filename="${filename}"`,
};

export const PAYMENT_RECEIPT_STRINGS = {
  TITLE: 'Comprobante de Pago',
  SUBTITLE: (orderId) => `Pedido #${orderId}`,
  SECTION_PAYMENT: 'Datos del Pago',
  SECTION_ORDER: 'Datos del Pedido',
  LABEL_AMOUNT: 'Monto cobrado',
  LABEL_METHOD: 'Método de pago',
  LABEL_REFERENCE: 'Número de referencia',
  LABEL_DATE: 'Fecha del cargo',
  LABEL_ORDER_ID: 'Número de pedido',
  LABEL_ORDER_DATE: 'Fecha del pedido',
  LABEL_TOTAL: 'Total del pedido',
  LABEL_CLIENT: 'Cliente',
  FOOTER: (brandName) => `Este documento fue generado automáticamente por ${brandName}.`,
  GENERATED_AT: (date) => `Generado el: ${date}`,
  NOT_FOUND_ERROR: 'Comprobante no disponible: pago no encontrado o no aprobado',
};

export const PAYMENT_RECEIPT_PDF_LAYOUT = {
  MARGIN: 50,
  HEADER_HEIGHT: 100,
  HEADER_PADDING_TOP: 22,
  SECTION_GAP: 24,
  FIELD_GAP: 14,
  DIVIDER_MARGIN_V: 16,
  PAGE_SIZE: 'A4',
};

export const PAYMENT_RECEIPT_PDF_STYLES = {
  FONT_BOLD: 'Helvetica-Bold',
  FONT_REGULAR: 'Helvetica',
  FONT_SIZE_BRAND: 18,
  FONT_SIZE_TITLE: 13,
  FONT_SIZE_SUBTITLE: 10,
  FONT_SIZE_SECTION: 10,
  FONT_SIZE_LABEL: 8,
  FONT_SIZE_VALUE: 11,
  FONT_SIZE_FOOTER: 8,
  COLOR_HEADER_BG: '#111827',
  COLOR_HEADER_TEXT: '#FFFFFF',
  COLOR_DIVIDER: '#E5E7EB',
  COLOR_LABEL: '#6B7280',
  COLOR_VALUE: '#111827',
  COLOR_SECTION: '#374151',
};

export const PAYMENT_RECEIPT_LOG_PREFIXES = {
  GENERATION_ERROR: '[PAYMENT_RECEIPT] Error al generar comprobante de pago.',
};

export const ORDER_STATUS_NOTIFICATION_DELIVERY_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
};

export const ACCOUNT_CHANGE_NOTIFICATION_MESSAGES = {
  PASSWORD_CHANGED_SUBJECT: (brandName) => `Tu contraseña fue cambiada — ${brandName}`,
  EMAIL_CHANGED_SUBJECT: (brandName) => `Tu correo electrónico fue actualizado — ${brandName}`,
  CLIENT_DATA_REQUIRED: 'Los datos del cliente son requeridos para enviar la notificación de cambio de cuenta',
  CLIENT_EMAIL_REQUIRED: 'El correo del cliente es requerido para enviar la notificación de cambio de cuenta',
  PREVIOUS_EMAIL_REQUIRED: 'El correo anterior es requerido para la notificación de cambio de correo',
  NEW_EMAIL_REQUIRED: 'El nuevo correo es requerido para la notificación de cambio de correo',
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
