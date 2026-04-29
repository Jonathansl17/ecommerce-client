import {
  EMAIL_CONFIG,
  NOTIFICATION_MESSAGES,
  PAYMENT_NOTIFICATION_MESSAGES,
} from '../notifications.constants.js';

const CRC_CURRENCY_FORMATTER = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function escaparHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatearMoneda(value) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return CRC_CURRENCY_FORMATTER.format(0);
  }

  return CRC_CURRENCY_FORMATTER.format(parsedValue);
}

export function formatearFechaLarga(value) {
  return new Date(value).toLocaleDateString('es-CR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatearFechaHora(value) {
  return new Date(value).toLocaleString('es-CR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calcularFechaEstimadaEntrega(createdAt) {
  const estimatedDate = new Date(createdAt);
  estimatedDate.setDate(estimatedDate.getDate() + EMAIL_CONFIG.DELIVERY_ESTIMATE_DAYS);
  return formatearFechaLarga(estimatedDate);
}

export function obtenerBrandingEmail() {
  return {
    brandName: EMAIL_CONFIG.BRAND_NAME,
    supportEmail: process.env.SUPPORT_EMAIL || process.env.EMAIL_FROM || 'support@example.com',
    supportPhone: process.env.SUPPORT_PHONE || 'No disponible',
  };
}

export function normalizarOrderItem(orderItem = {}) {
  const variant = orderItem.variant ?? {};
  const product = variant.product ?? {};
  const item = product.item ?? {};

  return {
    imageUrl: product.imageUrl ?? '',
    name: item.name ?? 'Producto del pedido',
    color: variant.color ?? 'No especificado',
    size: variant.size ?? 'No especificada',
    quantity: Number.isFinite(Number(orderItem.quantity)) ? Number(orderItem.quantity) : 0,
    unitPriceSnap: Number.isFinite(Number(orderItem.unitPriceSnap))
      ? Number(orderItem.unitPriceSnap)
      : 0,
  };
}

export function validarTemplateConfirmationInput({ order, clientUser }) {
  if (!order) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_ORDER_DATA_REQUIRED);
  }

  if (!clientUser) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_CLIENT_DATA_REQUIRED);
  }

  if (order.id == null) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_ORDER_ID_REQUIRED);
  }
}

export function validarTemplateOrderStatusInput({
  order,
  clientUser,
  newStatusLabel,
  changedAt,
}) {
  validarTemplateConfirmationInput({ order, clientUser });

  if (!newStatusLabel) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_TEMPLATE_NEW_STATUS_REQUIRED);
  }

  if (!changedAt) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_TEMPLATE_CHANGED_AT_REQUIRED);
  }
}

export function validarTemplatePaymentInput({ order, clientUser, payment }) {
  validarTemplateConfirmationInput({ order, clientUser });

  if (!payment) {
    throw new Error(PAYMENT_NOTIFICATION_MESSAGES.EMAIL_PAYMENT_DATA_REQUIRED);
  }

  if (payment.id == null) {
    throw new Error(PAYMENT_NOTIFICATION_MESSAGES.EMAIL_PAYMENT_ID_REQUIRED);
  }

  if (payment.amount == null) {
    throw new Error(PAYMENT_NOTIFICATION_MESSAGES.EMAIL_PAYMENT_AMOUNT_REQUIRED);
  }
}
