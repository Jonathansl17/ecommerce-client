import { apiFetch } from '@/lib/http/apiFetch';
import { ORDERS_API_PATHS } from '../constants/orders.constants';

export interface CancelOrderResponse {
  message: string;
  order: {
    id: string;
    status: string;
  };
}

export interface CancelOrderOptions {
  signal?: AbortSignal;
}

export async function cancelOrder(
  orderId: string,
  options?: CancelOrderOptions,
): Promise<CancelOrderResponse> {
  return apiFetch<CancelOrderResponse>(ORDERS_API_PATHS.cancelOrder(orderId), {
    method: 'POST',
    signal: options?.signal,
  });
}
