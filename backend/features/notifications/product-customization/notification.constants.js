export const PRODUCT_CUSTOMIZATION_NOTIFICATION = {
  ENTITY_TYPE: 'product_customization',
};

export const PRODUCT_CUSTOMIZATION_MESSAGES = {
  NOTIFICATION_TITLE: (orderId) =>
    `Tu producto personalizado está listo — Pedido #${orderId}`,
  NOTIFICATION_CONTENT: (message) =>
    message ??
    'Tu producto personalizado ha sido terminado. Revisa tu correo para ver las fotografías del resultado antes del envío.',
  EMAIL_SUBJECT: (orderId, brandName) =>
    `Tu producto personalizado está listo — Pedido #${orderId} | ${brandName}`,
  EMAIL_COPY: 'Verificá el resultado antes de que tu pedido pase a la siguiente etapa. Si tenés alguna observación, contactá a nuestro equipo de soporte.',
  IMAGES_ALT: (index) => `Fotografía del producto personalizado ${index + 1}`,
  VALIDATION_IMAGES_REQUIRED:
    'Se requiere al menos una imagen del producto terminado para enviar la notificación',
  VALIDATION_ORDER_REQUIRED:
    'El id de la orden es requerido para la notificación de producto personalizado terminado',
};

export const PRODUCT_CUSTOMIZATION_LOG_PREFIXES = {
  EMAIL_FAILURE:
    '[PRODUCT_CUSTOMIZATION_EMAIL_FAILURE] Fallo permanente al enviar correo de producto terminado.',
  EMAIL_RETRY_WARN:
    '[PRODUCT_CUSTOMIZATION_EMAIL_RETRY] No se pudo actualizar sendAttempts en DB.',
  EMAIL_RETRY_ATTEMPT: (intentos, max, orderId) =>
    `[PRODUCT_CUSTOMIZATION_EMAIL_RETRY] Intento ${intentos}/${max} fallido para pedido #${orderId}.`,
  TRIGGER_ERROR:
    '[PRODUCT_CUSTOMIZATION_TRIGGER] Error al procesar notificación de producto personalizado terminado.',
};

export const PRODUCT_CUSTOMIZATION_VALIDATION = {
  MIN_IMAGES: 1,
};
