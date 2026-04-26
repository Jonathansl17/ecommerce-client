import {
  ORDER_STATUS_NOTIFICATION_ERROR_CONTEXTS,
  ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES,
  ORDER_STATUS_NOTIFICATION_STRINGS,
} from '../constants/order-status-notification.constants';
import { OrderStatusNotificationRequestError } from '../api/order-status-notification.api';
import type {
  OrderStatusNotificationErrorContext,
  OrderStatusNotificationRequestErrorCode,
} from '../types/order-status-notification.types';

const SHARED_ERROR_MESSAGES: Partial<
  Record<OrderStatusNotificationRequestErrorCode, string>
> = {
  [ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES.AUTH_TOKEN_MISSING]:
    ORDER_STATUS_NOTIFICATION_STRINGS.missingAuthTokenError,
  [ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES.REQUEST_UNAUTHORIZED]:
    ORDER_STATUS_NOTIFICATION_STRINGS.missingAuthTokenError,
  [ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES.REQUEST_FORBIDDEN]:
    ORDER_STATUS_NOTIFICATION_STRINGS.forbiddenOrdersError,
  [ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES.INVALID_RESPONSE]:
    ORDER_STATUS_NOTIFICATION_STRINGS.invalidOrdersResponseError,
};

const CONTEXT_ERROR_MESSAGES: Record<
  OrderStatusNotificationErrorContext,
  Partial<Record<OrderStatusNotificationRequestErrorCode, string>>
> = {
  [ORDER_STATUS_NOTIFICATION_ERROR_CONTEXTS.ORDERS]: {},
  [ORDER_STATUS_NOTIFICATION_ERROR_CONTEXTS.DETAIL]: {
    [ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES.ORDER_ID_REQUIRED]:
      ORDER_STATUS_NOTIFICATION_STRINGS.missingOrderIdError,
    [ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES.ORDER_NOT_FOUND]:
      ORDER_STATUS_NOTIFICATION_STRINGS.orderNotFoundError,
  },
};

const FALLBACK_ERROR_MESSAGES: Record<OrderStatusNotificationErrorContext, string> = {
  [ORDER_STATUS_NOTIFICATION_ERROR_CONTEXTS.ORDERS]:
    ORDER_STATUS_NOTIFICATION_STRINGS.loadOrdersError,
  [ORDER_STATUS_NOTIFICATION_ERROR_CONTEXTS.DETAIL]:
    ORDER_STATUS_NOTIFICATION_STRINGS.loadOrderDetailError,
};

function isAuthRelatedError(code: OrderStatusNotificationRequestError['code']) {
  return (
    code === ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES.AUTH_TOKEN_MISSING ||
    code === ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES.REQUEST_UNAUTHORIZED
  );
}

function resolveOrderStatusNotificationErrorMessage(
  error: unknown,
  context: OrderStatusNotificationErrorContext,
) {
  if (!(error instanceof OrderStatusNotificationRequestError)) {
    return FALLBACK_ERROR_MESSAGES[context];
  }

  if (isAuthRelatedError(error.code)) {
    return ORDER_STATUS_NOTIFICATION_STRINGS.missingAuthTokenError;
  }

  return (
    CONTEXT_ERROR_MESSAGES[context][error.code] ??
    SHARED_ERROR_MESSAGES[error.code] ??
    FALLBACK_ERROR_MESSAGES[context]
  );
}

export function getOrderStatusNotificationOrdersErrorMessage(error: unknown) {
  return resolveOrderStatusNotificationErrorMessage(
    error,
    ORDER_STATUS_NOTIFICATION_ERROR_CONTEXTS.ORDERS,
  );
}

export function getOrderStatusNotificationDetailErrorMessage(error: unknown) {
  return resolveOrderStatusNotificationErrorMessage(
    error,
    ORDER_STATUS_NOTIFICATION_ERROR_CONTEXTS.DETAIL,
  );
}
