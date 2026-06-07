export const ORDERS_MESSAGES = {
  NOT_FOUND: 'Pedido no encontrado',
  CART_EMPTY: 'El carrito está vacío, agrega productos antes de hacer el pedido',
  CART_NOT_FOUND: 'No tienes un carrito activo',
  OUT_OF_STOCK: 'Stock insuficiente para uno o más productos',
  CHECKOUT_SUCCESS: 'Pedido creado exitosamente',
  STATUS_UPDATED_SUCCESS: 'Estado del pedido actualizado exitosamente',
  STATUS_UNCHANGED: 'El pedido ya tiene ese estado',
  CANCEL_ONLY_PENDING_PAYMENT: 'Solo puedes cancelar un pedido pendiente de pago',
  CANCEL_SUCCESS: 'Pedido cancelado exitosamente',
};

export const CANCELLABLE_ORDER_STATUS = 'pending_payment';
export const CANCELLED_ORDER_STATUS = 'cancelled';

export const PAYMENT_STATUSES = {
  APPROVED: 'approved',
};

export const PAYMENT_MESSAGES = {
  NOT_FOUND: 'Pago no encontrado para este pedido',
  ALREADY_APPROVED: 'El pago ya estaba aprobado',
  APPROVE_SUCCESS: 'Pago aprobado exitosamente',
};

export const ORDER_STATUS_VALUES = [
  'pending_payment',
  'confirmed',
  'in_preparation',
  'customization_in_progress',
  'ready_shipment',
  'shipped',
  'in_transit',
  'delivered',
  'cancelled',
];

export const ORDER_STATUS_TRANSITIONS = {
  pending_payment: ['confirmed', 'cancelled'],
  confirmed: ['in_preparation', 'cancelled'],
  in_preparation: ['customization_in_progress', 'ready_shipment', 'cancelled'],
  customization_in_progress: ['ready_shipment', 'cancelled'],
  ready_shipment: ['shipped'],
  shipped: ['in_transit'],
  in_transit: ['delivered'],
  delivered: [],
  cancelled: [],
};
