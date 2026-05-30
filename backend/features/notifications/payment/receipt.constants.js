export const PAYMENT_RECEIPT_PDF = {
  MIME_TYPE: 'application/pdf',
  FILENAME: (orderId) => `comprobante-pago-pedido-${orderId}.pdf`,
  CONTENT_DISPOSITION: (filename) => {
    const safe = filename.replace(/[^\w\-.]/g, '_');
    const encoded = encodeURIComponent(filename);
    return `attachment; filename="${safe}"; filename*=UTF-8''${encoded}`;
  },
};

export const PAYMENT_RECEIPT_STRINGS = {
  TITLE: 'Comprobante de Pago',
  SUBTITLE: (orderId) => `Pedido #${orderId}`,
  BADGE_APPROVED: 'PAGO APROBADO',
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
  HEADER_HEIGHT: 120,
  HEADER_PADDING_TOP: 28,
  SECTION_GAP: 20,
  FIELD_GAP: 14,
  DIVIDER_MARGIN_V: 16,
  CARD_PADDING_X: 20,
  CARD_PADDING_Y: 16,
  CARD_RADIUS: 6,
  BADGE_PADDING_X: 12,
  BADGE_PADDING_Y: 5,
  BADGE_RADIUS: 4,
  PAGE_SIZE: 'A4',
};

export const PAYMENT_RECEIPT_PDF_FONTS = {
  REGULAR_PATH: '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
  BOLD_PATH: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
  REGULAR: 'DejaVuSans',
  BOLD: 'DejaVuSans-Bold',
};

export const PAYMENT_RECEIPT_PDF_STYLES = {
  FONT_BOLD: 'DejaVuSans-Bold',
  FONT_REGULAR: 'DejaVuSans',
  FONT_SIZE_BRAND: 20,
  FONT_SIZE_TITLE: 13,
  FONT_SIZE_SUBTITLE: 10,
  FONT_SIZE_SECTION: 9,
  FONT_SIZE_LABEL: 8,
  FONT_SIZE_VALUE: 11,
  FONT_SIZE_BADGE: 8,
  FONT_SIZE_FOOTER: 8,
  COLOR_HEADER_BG: '#111827',
  COLOR_HEADER_TEXT: '#FFFFFF',
  COLOR_ACCENT: '#4F46E5',
  COLOR_BADGE_BG: '#D1FAE5',
  COLOR_BADGE_TEXT: '#065F46',
  COLOR_CARD_BG: '#F9FAFB',
  COLOR_CARD_BORDER: '#E5E7EB',
  COLOR_DIVIDER: '#E5E7EB',
  COLOR_LABEL: '#6B7280',
  COLOR_VALUE: '#111827',
  COLOR_SECTION: '#374151',
  COLOR_SECTION_LINE: '#4F46E5',
};

export const PAYMENT_RECEIPT_LOG_PREFIXES = {
  GENERATION_ERROR: '[PAYMENT_RECEIPT] Error al generar comprobante de pago.',
};
