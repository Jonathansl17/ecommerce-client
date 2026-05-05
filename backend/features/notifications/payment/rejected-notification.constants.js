export const PAYMENT_REJECTED_NOTIFICATION = {
  TRIGGER_DEADLINE_MS: 15 * 1000,
};

export const PAYMENT_REJECTED_MESSAGES = {
  REJECTED_TITLE: (orderId) => `Pago rechazado — Pedido #${orderId}`,
  REJECTED_CONTENT: ({ amount, method, reason }) =>
    `Intento de pago de ${amount} mediante ${method}. Motivo: ${reason}. Revisa tu pedido para reintentar con otras opciones.`,
  EMAIL_SUBJECT: (orderId, brandName) =>
    `Tu pago no pudo procesarse — Pedido #${orderId} | ${brandName}`,
  EMAIL_PAYMENT_DATA_REQUIRED:
    'Los datos del pago son requeridos para la notificación de rechazo',
  EMAIL_PAYMENT_ID_REQUIRED:
    'El id del pago es requerido para la notificación de rechazo',
  TIMEOUT_ERROR: 'Timeout de notificación de pago rechazado excedido',
};

export const PAYMENT_REJECTED_LOG_PREFIXES = {
  EMAIL_FAILURE:
    '[PAYMENT_REJECTED_EMAIL_FAILURE] Fallo permanente al enviar correo de pago rechazado.',
  EMAIL_RETRY_WARN:
    '[PAYMENT_REJECTED_EMAIL_RETRY] No se pudo actualizar sendAttempts en DB.',
  EMAIL_RETRY_ATTEMPT: (intentos, max, paymentId) =>
    `[PAYMENT_REJECTED_EMAIL_RETRY] Intento ${intentos}/${max} fallido para pago #${paymentId}.`,
  TRIGGER_ERROR:
    '[PAYMENT_REJECTED_TRIGGER] Error al procesar notificación de pago rechazado.',
};

export const PAYMENT_REJECTION_REASONS = {
  GENERIC: 'El pago no pudo procesarse en este momento',
};

export const PAYMENT_RETRY_ALTERNATIVES = [
  'Verifica que los datos de pago sean correctos',
  'Intenta con un método de pago diferente',
  'Contacta a tu banco si el problema persiste',
  'Vuelve a intentarlo en unos minutos',
];
