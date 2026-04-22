import { API_BASE_URL } from '@/lib/constants/api.constants';
import { AUTH_STORAGE_KEYS } from '@/features/auth/constants/auth.constants';
import { ORDER_STATUS_NOTIFICATION_API_STRINGS } from '../constants/order-status-notification.constants';
import type {
  OrderDetail,
  OrderDetailPaymentSummary,
  OrderListItem,
  OrderPaymentMethod,
  OrderPaymentStatus,
} from '../types/order-status-notification.types';

export type OrderStatusNotificationRequestErrorCode =
  | 'AUTH_TOKEN_MISSING'
  | 'ORDER_ID_REQUIRED'
  | 'REQUEST_UNAUTHORIZED'
  | 'REQUEST_FORBIDDEN'
  | 'ORDER_NOT_FOUND'
  | 'INVALID_RESPONSE'
  | 'ORDERS_FETCH_FAILED'
  | 'ORDER_DETAIL_FETCH_FAILED';

type TokenProvider = () => string | null;

interface OrderStatusNotificationRequestOptions {
  signal?: AbortSignal;
  getToken?: TokenProvider;
}

interface RawOrderProductCatalogItem {
  itemId: string;
  imageUrl: string;
  item: {
    name: string;
  };
}

interface RawOrderProductVariantSummary {
  id: string;
  color: string;
  size: string;
  product: RawOrderProductCatalogItem | null;
}

interface RawOrderDetailItem {
  id: string;
  quantity: number;
  unitPriceSnap: number;
  variant: RawOrderProductVariantSummary | null;
}

interface RawOrderDetail extends Omit<OrderDetail, 'orderItems'> {
  subtotal: number;
  taxes: number;
  shippingAddress: string;
  payments: OrderDetailPaymentSummary[];
  orderItems: RawOrderDetailItem[];
}

export class OrderStatusNotificationRequestError extends Error {
  code: OrderStatusNotificationRequestErrorCode;

  constructor(code: OrderStatusNotificationRequestErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = ORDER_STATUS_NOTIFICATION_API_STRINGS.errorName;
  }
}

function defaultTokenProvider() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
}

function getTokenOrThrow(getToken: TokenProvider = defaultTokenProvider) {
  const token = getToken();

  if (!token) {
    throw new OrderStatusNotificationRequestError(
      'AUTH_TOKEN_MISSING',
      ORDER_STATUS_NOTIFICATION_API_STRINGS.missingAuthToken,
    );
  }

  return token;
}

function getAuthHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isOrderPaymentMethod(value: unknown): value is OrderPaymentMethod {
  return value === 'SINPE' || value === 'cash' || value === 'card' || value === 'other';
}

function isOrderPaymentStatus(value: unknown): value is OrderPaymentStatus {
  return (
    value === 'pending' ||
    value === 'approved' ||
    value === 'rejected' ||
    value === 'voided'
  );
}

function isOrderStatusNotificationHistoryItem(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.newStatus === 'string' &&
    typeof value.changedAt === 'string' &&
    typeof value.deliveryStatus === 'string'
  );
}

function isOrderPaymentSummary(value: unknown) {
  return (
    isRecord(value) &&
    isOrderPaymentMethod(value.method) &&
    typeof value.amount === 'number' &&
    isOrderPaymentStatus(value.status)
  );
}

function isOrderListItemSummary(value: unknown) {
  return (
    isRecord(value) &&
    (value.id == null || typeof value.id === 'string') &&
    typeof value.quantity === 'number'
  );
}

function isRawOrderProductCatalogItem(value: unknown): value is RawOrderProductCatalogItem {
  return (
    isRecord(value) &&
    typeof value.itemId === 'string' &&
    typeof value.imageUrl === 'string' &&
    isRecord(value.item) &&
    typeof value.item.name === 'string'
  );
}

function isRawOrderProductVariantSummary(
  value: unknown,
): value is RawOrderProductVariantSummary {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.color === 'string' &&
    typeof value.size === 'string' &&
    (value.product == null || isRawOrderProductCatalogItem(value.product))
  );
}

function isRawOrderDetailItem(value: unknown): value is RawOrderDetailItem {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.quantity === 'number' &&
    typeof value.unitPriceSnap === 'number' &&
    (value.variant == null || isRawOrderProductVariantSummary(value.variant))
  );
}

function isOrderDetailPaymentSummary(
  value: unknown,
): value is OrderDetailPaymentSummary {
  return (
    isRecord(value) &&
    isOrderPaymentMethod(value.method) &&
    typeof value.amount === 'number' &&
    isOrderPaymentStatus(value.status) &&
    typeof value.id === 'string' &&
    typeof value.externalReference === 'string' &&
    typeof value.createdAt === 'string'
  );
}

function isOrderListItem(value: unknown): value is OrderListItem {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.status === 'string' &&
    typeof value.totalAmount === 'number' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    Array.isArray(value.payments) &&
    value.payments.every(isOrderPaymentSummary) &&
    Array.isArray(value.orderItems) &&
    value.orderItems.every(isOrderListItemSummary) &&
    Array.isArray(value.orderStatusNotifications) &&
    value.orderStatusNotifications.every(isOrderStatusNotificationHistoryItem)
  );
}

function isRawOrderDetail(value: unknown): value is RawOrderDetail {
  return (
    isRecord(value) &&
    isOrderListItem(value) &&
    typeof value.subtotal === 'number' &&
    typeof value.taxes === 'number' &&
    typeof value.shippingAddress === 'string' &&
    Array.isArray(value.payments) &&
    value.payments.every(isOrderDetailPaymentSummary) &&
    Array.isArray(value.orderItems) &&
    value.orderItems.every(isRawOrderDetailItem)
  );
}

function assertOrdersResponse(value: unknown): asserts value is OrderListItem[] {
  if (!Array.isArray(value) || !value.every(isOrderListItem)) {
    throw new OrderStatusNotificationRequestError(
      'INVALID_RESPONSE',
      ORDER_STATUS_NOTIFICATION_API_STRINGS.invalidOrdersResponseShape,
    );
  }
}

function assertOrderDetailResponse(value: unknown): asserts value is RawOrderDetail {
  if (!isRawOrderDetail(value)) {
    throw new OrderStatusNotificationRequestError(
      'INVALID_RESPONSE',
      ORDER_STATUS_NOTIFICATION_API_STRINGS.invalidOrderDetailResponseShape,
    );
  }
}

function normalizeOrderVariant(rawVariant: unknown) {
  if (!isRawOrderProductVariantSummary(rawVariant)) {
    return null;
  }

  return {
    id: rawVariant.id,
    color: rawVariant.color,
    size: rawVariant.size,
    product:
      rawVariant.product != null && isRawOrderProductCatalogItem(rawVariant.product)
        ? {
            itemId: rawVariant.product.itemId,
            imageUrl: rawVariant.product.imageUrl,
            itemName: rawVariant.product.item.name,
          }
        : null,
  };
}

function normalizeOrderListItem(payload: OrderListItem): OrderListItem {
  return {
    ...payload,
    orderItems: payload.orderItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    })),
  };
}

function normalizeOrderDetail(payload: RawOrderDetail): OrderDetail {
  return {
    ...payload,
    orderItems: payload.orderItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPriceSnap: item.unitPriceSnap,
      variant: normalizeOrderVariant(item.variant),
    })),
  };
}

async function parseJsonOrThrow(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new OrderStatusNotificationRequestError(
      'INVALID_RESPONSE',
      ORDER_STATUS_NOTIFICATION_API_STRINGS.invalidJsonResponse,
    );
  }
}

function buildHttpError(
  response: Response,
  fallbackCode: OrderStatusNotificationRequestErrorCode,
  fallbackMessage: string,
) {
  if (response.status === 401) {
    return new OrderStatusNotificationRequestError(
      'REQUEST_UNAUTHORIZED',
      ORDER_STATUS_NOTIFICATION_API_STRINGS.requestUnauthorized,
    );
  }

  if (response.status === 403) {
    return new OrderStatusNotificationRequestError(
      'REQUEST_FORBIDDEN',
      ORDER_STATUS_NOTIFICATION_API_STRINGS.requestForbidden,
    );
  }

  if (response.status === 404) {
    return new OrderStatusNotificationRequestError(
      'ORDER_NOT_FOUND',
      ORDER_STATUS_NOTIFICATION_API_STRINGS.orderNotFound,
    );
  }

  return new OrderStatusNotificationRequestError(fallbackCode, fallbackMessage);
}

export async function fetchOrderStatusNotificationOrderDetail(
  orderId: string,
  options?: OrderStatusNotificationRequestOptions,
): Promise<OrderDetail> {
  if (!orderId) {
    throw new OrderStatusNotificationRequestError(
      'ORDER_ID_REQUIRED',
      ORDER_STATUS_NOTIFICATION_API_STRINGS.missingOrderId,
    );
  }

  const response = await executeOrderStatusNotificationRequest({
    endpoint: `/orders/${orderId}`,
    options,
    fallbackErrorCode: 'ORDER_DETAIL_FETCH_FAILED',
    fallbackErrorMessage: ORDER_STATUS_NOTIFICATION_API_STRINGS.fetchOrderDetailFailed,
  });

  const payload = await parseJsonOrThrow(response);
  assertOrderDetailResponse(payload);

  return normalizeOrderDetail(payload);
}

async function executeOrderStatusNotificationRequest({
  endpoint,
  options,
  fallbackErrorCode,
  fallbackErrorMessage,
}: {
  endpoint: string;
  options?: OrderStatusNotificationRequestOptions;
  fallbackErrorCode: OrderStatusNotificationRequestErrorCode;
  fallbackErrorMessage: string;
}) {
  const token = getTokenOrThrow(options?.getToken);
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(token),
    signal: options?.signal,
  });

  if (!response.ok) {
    throw buildHttpError(
      response,
      fallbackErrorCode,
      fallbackErrorMessage,
    );
  }

  return response;
}

export async function fetchOrderStatusNotificationOrders(
  options?: OrderStatusNotificationRequestOptions,
): Promise<OrderListItem[]> {
  const response = await executeOrderStatusNotificationRequest({
    endpoint: '/orders',
    options,
    fallbackErrorCode: 'ORDERS_FETCH_FAILED',
    fallbackErrorMessage: ORDER_STATUS_NOTIFICATION_API_STRINGS.fetchOrdersFailed,
  });

  const payload = await parseJsonOrThrow(response);
  assertOrdersResponse(payload);

  return payload.map(normalizeOrderListItem);
}
