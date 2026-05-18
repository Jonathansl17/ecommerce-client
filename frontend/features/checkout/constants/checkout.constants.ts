import type { PaymentMethod } from '../types/checkout.types';

export const CHECKOUT_API_PATH = '/orders/checkout';

export const MIN_ADDRESS_LENGTH = 10;
export const MAX_ADDRESS_LENGTH = 300;
export const MAX_REFERENCE_LENGTH = 100;

export const CHECKOUT_STRINGS = {
  pageTitle: 'Finalizar pedido',
  pageSubtitle: 'Ingresa los datos de envío y pago para confirmar tu pedido.',
  addressLabel: 'Dirección de envío',
  addressPlaceholder: 'Ej: Calle 5, Av. 3, San José, Costa Rica',
  addressCounter: (current: number, max: number) => `${current} / ${max}`,
  paymentMethodLabel: 'Método de pago',
  externalReferenceLabel: 'Referencia externa (opcional)',
  externalReferencePlaceholder: 'Ej: número de comprobante SINPE',
  submitButton: 'Confirmar pedido',
  submittingButton: 'Enviando...',
  successMessage: 'Pedido creado exitosamente. Redirigiendo...',
  genericError: 'Ocurrió un error al procesar tu pedido. Intenta de nuevo.',
} as const;

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  SINPE: 'SINPE',
  cash: 'Efectivo',
  card: 'Tarjeta',
  other: 'Otro',
} as const;

export const PAYMENT_METHODS: PaymentMethod[] = ['SINPE', 'cash', 'card', 'other'];

export const CHECKOUT_ERROR_MESSAGES = {
  CART_EMPTY: 'Tu carrito está vacío. Agrega productos antes de hacer el pedido.',
  CART_NOT_FOUND: 'No tienes un carrito activo.',
  OUT_OF_STOCK: 'Stock insuficiente para uno o más productos en tu carrito.',
} as const;
