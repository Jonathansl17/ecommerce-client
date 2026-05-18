import { ApiError } from '@/lib/http/apiFetch';
import { CHECKOUT_ERROR_MESSAGES, CHECKOUT_STRINGS } from '../constants/checkout.constants';

type BackendErrorKey = keyof typeof CHECKOUT_ERROR_MESSAGES;

const BACKEND_MESSAGE_MAP: Record<string, BackendErrorKey> = {
  'El carrito está vacío, agrega productos antes de hacer el pedido': 'CART_EMPTY',
  'No tienes un carrito activo': 'CART_NOT_FOUND',
  'Stock insuficiente para uno o más productos': 'OUT_OF_STOCK',
};

function extractBackendMessage(body: unknown): string | null {
  if (body !== null && typeof body === 'object' && 'error' in body) {
    const candidate = (body as Record<string, unknown>).error;
    if (typeof candidate === 'string') return candidate;
  }
  return null;
}

export function translateCheckoutError(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return CHECKOUT_STRINGS.genericError;
  }

  const backendMessage = extractBackendMessage(error.body);
  if (backendMessage === null) return CHECKOUT_STRINGS.genericError;

  const key = BACKEND_MESSAGE_MAP[backendMessage];
  if (key !== undefined) return CHECKOUT_ERROR_MESSAGES[key];

  return CHECKOUT_STRINGS.genericError;
}
