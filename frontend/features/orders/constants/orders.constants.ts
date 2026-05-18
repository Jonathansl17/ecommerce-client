export const PENDING_PAYMENT_STATUS = 'pending_payment' as const;

export const ORDERS_API_PATHS = {
  cancelOrder: (orderId: string) => `/orders/${orderId}/cancel`,
} as const;

export const ORDERS_STRINGS = {
  cancelButton: 'Cancelar pedido',
  confirmTitle: '¿Cancelar pedido?',
  confirmDescription:
    'Esta acción cancelará tu pedido. Solo es posible hacerlo mientras el pago esté pendiente. ¿Deseas continuar?',
  confirmAccept: 'Sí, cancelar pedido',
  confirmCancel: 'Volver',
  errorGeneric: 'No se pudo cancelar el pedido. Intentá de nuevo más tarde.',
  errorConflict:
    'El pedido ya no puede cancelarse porque su estado cambió.',
  errorNotFound: 'No se encontró el pedido o no tenés permisos para cancelarlo.',
  successMessage: 'Tu pedido fue cancelado correctamente.',
  statusRequirement:
    'Solo podés cancelar un pedido mientras su pago esté pendiente.',
} as const;
