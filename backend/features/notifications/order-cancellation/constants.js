export const CANCELLATION_NOTIFICATION = {
  TRIGGER_DEADLINE_MS: 15 * 1000,
};

export const CANCELLATION_REASONS = {
  CLIENT_REQUEST: 'client_request',
  ADMIN_DECISION: 'admin_decision',
  STOCK_SHORTAGE: 'stock_shortage',
  PAYMENT_FAILURE: 'payment_failure',
};

export const CANCELLATION_REASON_LABELS = {
  client_request: 'Solicitud del cliente',
  admin_decision: 'Decisión administrativa',
  stock_shortage: 'Falta de stock disponible',
  payment_failure: 'Fallo en el proceso de pago',
};

export const CANCELLATION_NOTIFICATION_MESSAGES = {
  TITLE: (orderId) => `Pedido #${orderId} cancelado`,
  CONTENT: ({ reason, supportEmail }) =>
    `Tu pedido fue cancelado. Motivo: ${reason}. Si tienes dudas, contacta a soporte: ${supportEmail}.`,
  DEFAULT_REASON: 'El pedido no pudo completarse',
  EMAIL_PREVIEW: (orderId, reasonLabel) =>
    `Tu pedido #${orderId} fue cancelado. Motivo: ${reasonLabel}.`,
  EMAIL_SUBJECT: (orderId, brandName) =>
    `Tu pedido #${orderId} ha sido cancelado — ${brandName}`,
  TIMEOUT_ERROR: 'Timeout de notificación de cancelación excedido',
};

export const CANCELLATION_NOTIFICATION_LOG_PREFIXES = {
  EMAIL_FAILURE:
    '[CANCELLATION_EMAIL_FAILURE] Fallo permanente al enviar correo de cancelación de pedido.',
  EMAIL_RETRY_WARN:
    '[CANCELLATION_EMAIL_RETRY] No se pudo actualizar sendAttempts en DB.',
  EMAIL_RETRY_ATTEMPT: (intentos, max, orderId) =>
    `[CANCELLATION_EMAIL_RETRY] Intento ${intentos}/${max} fallido para pedido #${orderId}.`,
  TRIGGER_ERROR:
    '[CANCELLATION_TRIGGER] Error al procesar notificación de cancelación de pedido.',
};
