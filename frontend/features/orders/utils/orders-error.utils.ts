import { ApiError } from '@/lib/http/apiFetch';
import { ORDERS_STRINGS } from '../constants/orders.constants';

export function translateCancelOrderError(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return ORDERS_STRINGS.errorGeneric;
  }

  if (error.status === 409) {
    return ORDERS_STRINGS.errorConflict;
  }

  if (error.status === 404) {
    return ORDERS_STRINGS.errorNotFound;
  }

  return ORDERS_STRINGS.errorGeneric;
}
