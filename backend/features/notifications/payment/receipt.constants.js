import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const FONTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../../assets/fonts');

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
  PAGE_SIZE: 'A4',
  // Info grid
  INFO_ROW_H: 36,
  INFO_CLIENT_H: 44,
  SECTION_GAP: 20,
  // Tabla
  TABLE_ROW_H: 26,
  TABLE_HEADER_H: 22,
  TABLE_COL_CANT_W: 48,
  TABLE_COL_PRECIO_W: 95,
  TABLE_COL_IMPORTE_W: 90,
  TABLE_BOTTOM_GAP: 12,
  // Total / footer
  TOTAL_BOX_H: 36,
  TOTAL_BOTTOM_GAP: 28,
  // Info pago
  PAYMENT_TITLE_GAP: 14,
  PAYMENT_LINE_H: 13,
  PAYMENT_SECTION_GAP: 16,
};

export const PAYMENT_RECEIPT_PDF_FONTS = {
  REGULAR_PATH: join(FONTS_DIR, 'DejaVuSans.ttf'),
  BOLD_PATH:    join(FONTS_DIR, 'DejaVuSans-Bold.ttf'),
  REGULAR: 'DejaVuSans',
  BOLD:    'DejaVuSans-Bold',
};

export const PAYMENT_RECEIPT_PDF_STYLES = {
  FONT_BOLD:    'DejaVuSans-Bold',
  FONT_REGULAR: 'DejaVuSans',
  FONT_SIZE_BRAND:    20,
  FONT_SIZE_TITLE:    13,
  FONT_SIZE_SUBTITLE: 10,
  FONT_SIZE_SECTION:   9,
  FONT_SIZE_LABEL:     8,
  FONT_SIZE_VALUE:    11,
  FONT_SIZE_BADGE:     8,
  FONT_SIZE_FOOTER:    8,
  COLOR_WHITE:        '#FFFFFF',
  COLOR_ROW_ALT:      '#F9FAFB',
  COLOR_HEADER_BG:    '#111827',
  COLOR_HEADER_TEXT:  '#FFFFFF',
  COLOR_ACCENT:       '#4F46E5',
  COLOR_BADGE_BG:     '#D1FAE5',
  COLOR_BADGE_TEXT:   '#065F46',
  COLOR_CARD_BG:      '#F9FAFB',
  COLOR_CARD_BORDER:  '#E5E7EB',
  COLOR_DIVIDER:      '#E5E7EB',
  COLOR_LABEL:        '#6B7280',
  COLOR_VALUE:        '#111827',
  COLOR_SECTION:      '#374151',
  COLOR_SECTION_LINE: '#4F46E5',
};

export const PAYMENT_RECEIPT_LOG_PREFIXES = {
  GENERATION_ERROR: '[PAYMENT_RECEIPT] Error al generar comprobante de pago.',
};
