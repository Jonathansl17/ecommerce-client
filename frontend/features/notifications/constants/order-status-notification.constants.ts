export const ORDER_STATUS_NOTIFICATION_STATUS_VALUES = [
  'pending_payment',
  'confirmed',
  'in_preparation',
  'customization_in_progress',
  'ready_shipment',
  'shipped',
  'in_transit',
  'delivered',
  'cancelled',
] as const;

export const ORDER_STATUS_NOTIFICATION_STATUS_LABELS = {
  pending_payment: 'Pago pendiente',
  confirmed: 'Confirmado',
  in_preparation: 'En preparación',
  customization_in_progress: 'Personalización en proceso',
  ready_shipment: 'Listo para envío',
  shipped: 'Enviado',
  in_transit: 'En tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
} as const;

export const ORDER_STATUS_NOTIFICATION_DELIVERY_STATUS_VALUES = [
  'pending',
  'sent',
  'failed',
] as const;

export const ORDER_STATUS_NOTIFICATION_DELIVERY_LABELS = {
  pending: 'Pendiente de envío',
  sent: 'Enviada',
  failed: 'Falló el envío externo',
} as const;

export const ORDER_STATUS_NOTIFICATION_DELIVERY_TONES = {
  pending: 'bg-secondary text-secondary-foreground',
  sent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  failed: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
} as const;

export const ORDER_STATUS_NOTIFICATION_STRINGS = {
  ordersTitle: 'Mis pedidos',
  ordersSubtitle:
    'Consulta el estado actual y el historial completo de cambios de cada pedido.',
  emptyOrders: 'Aún no tienes pedidos registrados.',
  loading: 'Cargando historial de pedidos...',
  loadError: 'No se pudo cargar el historial de pedidos',
  loadOrdersError: 'No se pudo cargar la lista de pedidos',
  loadOrderDetailError: 'No se pudo cargar el detalle del pedido',
  missingOrderIdError: 'No se recibió un identificador de pedido válido',
  missingAuthTokenError: 'Debes iniciar sesión para consultar tus pedidos',
  forbiddenOrdersError: 'No tienes permisos para consultar estos pedidos',
  orderNotFoundError: 'No se encontró el pedido solicitado',
  invalidOrdersResponseError: 'La respuesta del servidor de pedidos no tiene el formato esperado',
  orderNumber: (orderId: string) => `Pedido #${orderId}`,
  orderDate: 'Fecha de compra',
  currentStatus: 'Estado actual',
  timelineTitle: 'Historial de cambio de estado',
  timelineEmpty: 'Este pedido todavía no tiene cambios de estado registrados.',
  previousStatus: 'Estado anterior',
  previousStatusEmpty: 'Sin estado previo',
  newStatus: 'Estado nuevo',
  changedAt: 'Fecha/hora del cambio',
  deliveryStatus: 'Entrega de notificación',
  viewDetail: 'Ver detalle',
  backToOrders: 'Volver a pedidos',
  shippingAddress: 'Dirección de envío',
  orderSummary: 'Resumen del pedido',
  productsTitle: 'Productos del pedido',
  paymentTitle: 'Pago',
  totalAmount: 'Total',
  subtotal: 'Subtotal',
  taxes: 'Impuestos',
  quantity: 'Cantidad',
  externalDeliveryFailure:
    'La notificación sigue visible en la bandeja interna aunque el envío externo haya fallado.',
  missingIntegrationComment:
    'TODO(order_status_notification): connect this page to the future backoffice status-change trigger when that workflow is available.',
} as const;

export const ORDER_STATUS_NOTIFICATION_API_STRINGS = {
  errorName: 'OrderStatusNotificationRequestError',
  missingAuthToken: 'Missing auth token',
  missingOrderId: 'Order id is required',
  invalidOrdersResponseShape: 'Invalid orders response shape',
  invalidOrderDetailResponseShape: 'Invalid order detail response shape',
  invalidJsonResponse: 'Response body is not valid JSON',
  requestUnauthorized: 'Request unauthorized',
  requestForbidden: 'Request forbidden',
  orderNotFound: 'Order not found',
  fetchOrderDetailFailed: 'Unable to fetch order detail',
  fetchOrdersFailed: 'Unable to fetch orders',
  ordersRequestKey: 'order-status-notification-orders',
  orderDetailRequestKey: (orderId: string | null) =>
    `order-status-notification-detail:${orderId ?? 'missing'}`,
} as const;

export const ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES = {
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  ORDER_ID_REQUIRED: 'ORDER_ID_REQUIRED',
  REQUEST_UNAUTHORIZED: 'REQUEST_UNAUTHORIZED',
  REQUEST_FORBIDDEN: 'REQUEST_FORBIDDEN',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  ORDERS_FETCH_FAILED: 'ORDERS_FETCH_FAILED',
  ORDER_DETAIL_FETCH_FAILED: 'ORDER_DETAIL_FETCH_FAILED',
} as const;

export const ORDER_STATUS_NOTIFICATION_PAYMENT_METHOD_VALUES = [
  'SINPE',
  'cash',
  'card',
  'other',
] as const;

export const ORDER_STATUS_NOTIFICATION_PAYMENT_STATUS_VALUES = [
  'pending',
  'approved',
  'rejected',
  'voided',
] as const;

export const ORDER_STATUS_NOTIFICATION_ERROR_CONTEXTS = {
  ORDERS: 'orders',
  DETAIL: 'detail',
} as const;
