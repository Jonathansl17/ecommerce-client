'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  OrderStatusNotificationAsyncState,
  OrderStatusNotificationResolvedState,
  UseOrderStatusNotificationRequestOptions,
} from '../types/order-status-notification.types';

export function useOrderStatusNotificationRequest<TData>({
  requestKey,
  enabled = true,
  initialData,
  getErrorMessage,
  request,
}: UseOrderStatusNotificationRequestOptions<TData>): OrderStatusNotificationAsyncState<TData> {
  const requestIdRef = useRef(0);
  const [state, setState] = useState<OrderStatusNotificationResolvedState<TData>>({
    requestKey,
    data: initialData,
    error: null,
    status: 'idle',
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();
    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;

    request({ signal: controller.signal })
      .then((data) => {
        if (requestIdRef.current !== currentRequestId) return;

        setState({
          requestKey,
          data,
          error: null,
          status: 'success',
        });
      })
      .catch((error) => {
        if (controller.signal.aborted || requestIdRef.current !== currentRequestId) return;

        setState({
          requestKey,
          data: initialData,
          error: getErrorMessage(error),
          status: 'error',
        });
      });

    return () => {
      controller.abort();
    };
  }, [enabled, getErrorMessage, initialData, request, requestKey]);

  if (!enabled) {
    return {
      data: initialData,
      cargando: false,
      error: null,
    };
  }

  if (state.requestKey !== requestKey) {
    return {
      data: initialData,
      cargando: true,
      error: null,
    };
  }

  return {
    data: state.data,
    cargando: state.status === 'idle',
    error: state.error,
  };
}
