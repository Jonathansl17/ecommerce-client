import { apiFetch } from '@/lib/http/apiFetch';
import { CHECKOUT_API_PATH } from '../constants/checkout.constants';
import type { CheckoutPayload, CheckoutResponse } from '../types/checkout.types';

export async function submitCheckout(
  payload: CheckoutPayload,
  options: { signal?: AbortSignal } = {},
): Promise<{ orderId: string }> {
  const response = await apiFetch<CheckoutResponse>(CHECKOUT_API_PATH, {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
    signal: options.signal,
  });

  return { orderId: response.order.id };
}
