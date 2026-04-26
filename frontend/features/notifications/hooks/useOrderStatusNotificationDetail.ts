'use client';

import { useCallback } from 'react';
import {
  ORDER_STATUS_NOTIFICATION_API_STRINGS,
  ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES,
  ORDER_STATUS_NOTIFICATION_STRINGS,
} from '../constants/order-status-notification.constants';
import {
  fetchOrderStatusNotificationOrderDetail,
  OrderStatusNotificationRequestError,
} from '../api/order-status-notification.api';
import type { UseOrderStatusNotificationDetailResult } from '../types/order-status-notification.types';
import { getOrderStatusNotificationDetailErrorMessage } from '../utils/order-status-notification-error.utils';
import { useOrderStatusNotificationRequest } from './useOrderStatusNotificationRequest';

export function useOrderStatusNotificationDetail(
  orderId: string | null,
): UseOrderStatusNotificationDetailResult {
  const request = useCallback(
    ({ signal }: { signal: AbortSignal }) => {
      if (!orderId) {
        return Promise.reject(
          new OrderStatusNotificationRequestError(
            ORDER_STATUS_NOTIFICATION_REQUEST_ERROR_CODES.ORDER_ID_REQUIRED,
            ORDER_STATUS_NOTIFICATION_API_STRINGS.missingOrderId,
          ),
        );
      }

      return fetchOrderStatusNotificationOrderDetail(orderId, { signal });
    },
    [orderId],
  );

  const getErrorMessage = useCallback(
    (error: unknown) => getOrderStatusNotificationDetailErrorMessage(error),
    [],
  );

  const { data, cargando, error } = useOrderStatusNotificationRequest({
    requestKey: ORDER_STATUS_NOTIFICATION_API_STRINGS.orderDetailRequestKey(orderId),
    enabled: orderId != null,
    initialData: null,
    getErrorMessage,
    request,
  });

  if (!orderId) {
    return {
      pedido: null,
      cargando: false,
      error: ORDER_STATUS_NOTIFICATION_STRINGS.missingOrderIdError,
    };
  }

  return {
    pedido: data,
    cargando,
    error,
  };
}
