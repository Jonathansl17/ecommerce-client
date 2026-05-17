export const PRODUCT_CUSTOMIZATION_APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  ADJUSTMENTS_REQUESTED: 'adjustments_requested',
  AUTO_APPROVED: 'auto_approved',
};

export const PRODUCT_CUSTOMIZATION_APPROVAL_EVENTS = {
  PRODUCT_READY_FOR_APPROVAL: 'ProductReadyForApproval',
  PRODUCT_APPROVED_BY_CLIENT: 'ProductApprovedByClient',
  PRODUCT_ADJUSTMENT_REQUESTED: 'ProductAdjustmentRequested',
  PRODUCT_AUTO_APPROVED: 'ProductAutoApproved',
};

export const PRODUCT_CUSTOMIZATION_APPROVAL_DEADLINE = {
  HOURS: 48,
  MS: 48 * 60 * 60 * 1000,
};

export const PRODUCT_CUSTOMIZATION_APPROVAL_SCHEDULER = {
  CHECK_INTERVAL_MS: 15 * 60 * 1000,
};

export const PRODUCT_CUSTOMIZATION_APPROVAL_ENTITY_TYPE = 'product_customization_approval';

export const PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES = {
  APPROVAL_REQUEST_TITLE: (orderId) => `Aprueba tu producto personalizado — Pedido #${orderId}`,
  CLIENT_APPROVED_TITLE: (orderId) => `Producto aprobado — Pedido #${orderId}`,
  ADJUSTMENT_REQUESTED_TITLE: (orderId) => `Ajustes recibidos — Pedido #${orderId}`,
  AUTO_APPROVED_TITLE: (orderId) => `Producto aprobado automáticamente — Pedido #${orderId}`,

  APPROVAL_REQUEST_CONTENT:
    'Tu producto personalizado está listo. Revísalo y apruébalo o solicita ajustes desde tu correo.',
  CLIENT_APPROVED_CONTENT:
    'Aprobaste el producto. Tu pedido procederá a la etapa de envío en breve.',
  ADJUSTMENT_REQUESTED_CONTENT: (notes) =>
    `Recibimos tu solicitud de ajustes. Nuestro equipo la revisará pronto. Detalle: "${notes}"`,
  AUTO_APPROVED_CONTENT: (hours) =>
    `No recibimos respuesta en ${hours} horas. El producto fue aprobado automáticamente y tu pedido procederá al envío.`,

  EMAIL_SUBJECT_APPROVAL_REQUEST: (orderId, brandName) =>
    `Aprueba tu producto personalizado — Pedido #${orderId} | ${brandName}`,
  EMAIL_SUBJECT_CLIENT_APPROVED: (orderId, brandName) =>
    `Producto aprobado — Pedido #${orderId} | ${brandName}`,
  EMAIL_SUBJECT_ADJUSTMENT_REQUESTED: (orderId, brandName) =>
    `Ajustes recibidos — Pedido #${orderId} | ${brandName}`,
  EMAIL_SUBJECT_AUTO_APPROVED: (orderId, brandName) =>
    `Aprobación automática — Pedido #${orderId} | ${brandName}`,

  NOT_FOUND: 'No se encontró una aprobación pendiente para este pedido',
  ALREADY_RESPONDED: 'Ya se registró una respuesta para este pedido',
  ADJUSTMENT_NOTES_REQUIRED: 'La descripción de los ajustes es obligatoria',
  ADJUSTMENT_NOTES_TOO_LONG: `La descripción de los ajustes no puede superar ${1000} caracteres`,
  CLIENT_APPROVED_OK: 'Producto aprobado correctamente',
  ADJUSTMENTS_REQUESTED_OK: 'Solicitud de ajustes registrada correctamente',
};

export const PRODUCT_CUSTOMIZATION_APPROVAL_LOG_PREFIXES = {
  EMAIL_FAILURE:
    '[APPROVAL_EMAIL_FAILURE] Fallo permanente al enviar correo de aprobación.',
  EMAIL_RETRY_WARN:
    '[APPROVAL_EMAIL_RETRY] No se pudo actualizar sendAttempts en DB.',
  EMAIL_RETRY_ATTEMPT: (intentos, max, orderId) =>
    `[APPROVAL_EMAIL_RETRY] Intento ${intentos}/${max} fallido para pedido #${orderId}.`,
  TRIGGER_ERROR:
    '[APPROVAL_TRIGGER] Error al procesar notificación de aprobación.',
  SCHEDULER_ERROR:
    '[APPROVAL_SCHEDULER] Error al procesar aprobación automática.',
  SCHEDULER_AUTO_APPROVED: (orderId) =>
    `[APPROVAL_SCHEDULER] Pedido #${orderId} aprobado automáticamente por vencimiento de plazo.`,
};

export const PRODUCT_CUSTOMIZATION_APPROVAL_VALIDATION = {
  MAX_ADJUSTMENT_NOTES_LENGTH: 1000,
};
