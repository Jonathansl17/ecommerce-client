export const LOW_STOCK_ALERT = {
  TRIGGER_DEADLINE_MS: 30 * 1000,
  SCHEDULER_INTERVAL_MS: 60 * 60 * 1000,
  SALES_WINDOW_DAYS: 30,
};

export const LOW_STOCK_MESSAGES = {
  EMAIL_SUBJECT: (productName, brandName) =>
    `[Alerta de inventario] ${productName} — ${brandName}`,
  EMAIL_PREVIEW: (productName, stockDisponible) =>
    `Stock disponible de ${productName}: ${stockDisponible} unidades. Por debajo del umbral mínimo.`,
  TIMEOUT_ERROR: 'Timeout de alerta de inventario bajo excedido',
  VARIANT_REQUIRED: 'La variante es requerida para enviar alerta de inventario',
  VARIANT_ID_REQUIRED: 'El id de la variante es requerido para la alerta de inventario',
  ADMIN_EMAIL_MISSING: 'No se encontró email de administrador (ADMIN_EMAIL o EMAIL_FROM)',
};

export const LOW_STOCK_LOG_PREFIXES = {
  EMAIL_FAILURE:
    '[LOW_STOCK_EMAIL_FAILURE] Fallo permanente al enviar alerta de inventario bajo.',
  EMAIL_RETRY_ATTEMPT: (intentos, max, variantId) =>
    `[LOW_STOCK_EMAIL_RETRY] Intento ${intentos}/${max} fallido para variante #${variantId}.`,
  TRIGGER_ERROR:
    '[LOW_STOCK_TRIGGER] Error al procesar alerta de inventario bajo.',
  MONITOR_START:
    '[LOW_STOCK_MONITOR] Iniciando escaneo de variantes con stock bajo.',
  MONITOR_FOUND: (count) =>
    `[LOW_STOCK_MONITOR] ${count} variante(s) con stock bajo sin alerta previa encontradas.`,
  MONITOR_ALERTED: (variantId) =>
    `[LOW_STOCK_MONITOR] Alerta disparada para variante #${variantId}.`,
  MONITOR_ERROR:
    '[LOW_STOCK_MONITOR] Error durante el escaneo de inventario.',
  MONITOR_VARIANT_ERROR: (variantId) =>
    `[LOW_STOCK_MONITOR] Error al procesar variante #${variantId}.`,
  SCHEDULER_ERROR:
    '[LOW_STOCK_SCHEDULER] Error al ejecutar el monitor de stock.',
};
