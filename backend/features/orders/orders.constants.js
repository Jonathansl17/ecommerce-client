export const ORDERS_MESSAGES = {
  NOT_FOUND: 'Pedido no encontrado',
  CART_EMPTY: 'El carrito está vacío, agrega productos antes de hacer el pedido',
  CART_NOT_FOUND: 'No tienes un carrito activo',
  OUT_OF_STOCK: 'Stock insuficiente para uno o más productos',
  CHECKOUT_SUCCESS: 'Pedido creado exitosamente',
  STATUS_UPDATED_SUCCESS: 'Estado del pedido actualizado exitosamente',
  STATUS_UNCHANGED: 'El pedido ya tiene ese estado',
};

export const PAYMENT_MESSAGES = {
  NOT_FOUND: 'Pago no encontrado para este pedido',
  ALREADY_APPROVED: 'El pago ya estaba aprobado',
  APPROVE_SUCCESS: 'Pago aprobado exitosamente',
};

export const TAX_RATE = 0.13; // IVA Costa Rica 13%

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
