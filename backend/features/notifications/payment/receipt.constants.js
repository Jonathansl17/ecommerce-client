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
