import { ApiError } from '@/lib/http/apiFetch';
import { CART_STRINGS } from '../constants/cart.constants';

// Backend error message substrings (from cart.constants.js)
const BACKEND_OUT_OF_STOCK = 'Stock insuficiente';
const BACKEND_PRODUCT_INACTIVE = 'no está disponible';
const BACKEND_ITEM_NOT_FOUND = 'Ítem del carrito no encontrado';

function extractBackendMessage(error: unknown): string | null {
  if (!(error instanceof ApiError)) return null;
  const body = error.body;
  if (body != null && typeof body === 'object' && 'message' in body) {
    const msg = (body as { message: unknown }).message;
    return typeof msg === 'string' ? msg : null;
  }
  return null;
}

export function resolveCartMutationError(error: unknown, fallback: string): string {
  const backendMessage = extractBackendMessage(error);

  if (backendMessage !== null) {
    if (backendMessage.includes(BACKEND_OUT_OF_STOCK)) {
      return CART_STRINGS.outOfStock;
    }
    if (backendMessage.includes(BACKEND_PRODUCT_INACTIVE)) {
      return CART_STRINGS.productInactive;
    }
    if (backendMessage.includes(BACKEND_ITEM_NOT_FOUND)) {
      return CART_STRINGS.itemNotFound;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function resolveCartFetchError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return CART_STRINGS.loadError;
}
