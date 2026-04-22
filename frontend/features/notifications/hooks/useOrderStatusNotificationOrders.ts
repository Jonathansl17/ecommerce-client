'use client';

import { useCallback } from 'react';
import {
  ORDER_STATUS_NOTIFICATION_API_STRINGS,
} from '../constants/order-status-notification.constants';
import {
  fetchOrderStatusNotificationOrders,
} from '../shared/order-status-notification.api';
import type {
  OrderListItem,
  UseOrderStatusNotificationOrdersResult,
} from '../types/order-status-notification.types';
import { getOrderStatusNotificationOrdersErrorMessage } from '../utils/order-status-notification-error.utils';
import { useOrderStatusNotificationRequest } from './useOrderStatusNotificationRequest';

const EMPTY_ORDERS: OrderListItem[] = [];

export function useOrderStatusNotificationOrders(): UseOrderStatusNotificationOrdersResult {
  const request = useCallback(
    ({ signal }: { signal: AbortSignal }) =>
      fetchOrderStatusNotificationOrders({ signal }),
    [],
  );

  const getErrorMessage = useCallback(
    (error: unknown) => getOrderStatusNotificationOrdersErrorMessage(error),
    [],
  );

  const { data, cargando, error } = useOrderStatusNotificationRequest({
    requestKey: ORDER_STATUS_NOTIFICATION_API_STRINGS.ordersRequestKey,
    initialData: EMPTY_ORDERS,
    getErrorMessage,
    request,
  });

  return {
    pedidos: data,
    cargando,
    error,
  };
}
