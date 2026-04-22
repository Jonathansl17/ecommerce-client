import type {
  ORDER_STATUS_NOTIFICATION_DELIVERY_STATUS_VALUES,
  ORDER_STATUS_NOTIFICATION_ERROR_CONTEXTS,
  ORDER_STATUS_NOTIFICATION_PAYMENT_METHOD_VALUES,
  ORDER_STATUS_NOTIFICATION_PAYMENT_STATUS_VALUES,
  ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES,
  ORDER_STATUS_NOTIFICATION_STATUS_VALUES,
} from '../constants/order-status-notification.constants';

export type OrderStatusNotificationStatus =
  (typeof ORDER_STATUS_NOTIFICATION_STATUS_VALUES)[number];

export type OrderStatusNotificationDeliveryStatus =
  (typeof ORDER_STATUS_NOTIFICATION_DELIVERY_STATUS_VALUES)[number];

export type OrderPaymentMethod =
  (typeof ORDER_STATUS_NOTIFICATION_PAYMENT_METHOD_VALUES)[number];

export type OrderPaymentStatus =
  (typeof ORDER_STATUS_NOTIFICATION_PAYMENT_STATUS_VALUES)[number];

export type OrderStatusNotificationRequestErrorCode =
  (typeof ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES)[keyof typeof ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES];

export type OrderStatusNotificationErrorContext =
  (typeof ORDER_STATUS_NOTIFICATION_ERROR_CONTEXTS)[keyof typeof ORDER_STATUS_NOTIFICATION_ERROR_CONTEXTS];

export interface OrderStatusNotificationHistoryItem {
  id: string;
  previousStatus: OrderStatusNotificationStatus | null;
  newStatus: OrderStatusNotificationStatus;
  changedAt: string;
  deliveryStatus: OrderStatusNotificationDeliveryStatus;
  deliveryAttempts: number;
  deliveryLastError: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

export interface OrderPaymentSummaryBase {
  method: OrderPaymentMethod;
  amount: number;
  status: OrderPaymentStatus;
}

export type OrderListPaymentSummary = OrderPaymentSummaryBase;

export interface OrderDetailPaymentSummary extends OrderPaymentSummaryBase {
  id: string;
  externalReference: string;
  createdAt: string;
}

export interface OrderListItemSummary {
  id?: string;
  quantity: number;
}

export interface OrderProductCatalogItem {
  itemId: string;
  imageUrl: string;
  itemName: string;
}

export interface OrderProductVariantSummary {
  id: string;
  color: string;
  size: string;
  product: OrderProductCatalogItem | null;
}

export interface OrderListItem {
  id: string;
  status: OrderStatusNotificationStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  payments: OrderListPaymentSummary[];
  orderItems: OrderListItemSummary[];
  orderStatusNotifications: OrderStatusNotificationHistoryItem[];
}

export interface OrderDetailItem {
  id: string;
  quantity: number;
  unitPriceSnap: number;
  variant: OrderProductVariantSummary | null;
}

export interface OrderDetail {
  id: string;
  status: OrderStatusNotificationStatus;
  subtotal: number;
  taxes: number;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  payments: OrderDetailPaymentSummary[];
  orderItems: OrderDetailItem[];
  orderStatusNotifications: OrderStatusNotificationHistoryItem[];
}

export interface OrderStatusTimelineProps {
  historial: OrderStatusNotificationHistoryItem[];
}

export interface UseOrderStatusNotificationOrdersResult {
  pedidos: OrderListItem[];
  cargando: boolean;
  error: string | null;
}

export interface UseOrderStatusNotificationDetailResult {
  pedido: OrderDetail | null;
  cargando: boolean;
  error: string | null;
}

export interface OrderStatusNotificationAsyncState<TData> {
  data: TData;
  cargando: boolean;
  error: string | null;
}

export interface UseOrderStatusNotificationRequestOptions<TData> {
  requestKey: string;
  enabled?: boolean;
  initialData: TData;
  getErrorMessage: (error: unknown) => string;
  request: (context: { signal: AbortSignal }) => Promise<TData>;
}

export interface OrderStatusNotificationResolvedState<TData> {
  requestKey: string;
  data: TData;
  error: string | null;
  status: 'idle' | 'success' | 'error';
}
