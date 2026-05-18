import { CATALOG_REQUEST_ERROR_CODES, CATALOG_STRINGS } from '../constants/catalog.constants';
import { CatalogRequestError } from '../api/catalog.api';
import type { CatalogRequestErrorCode } from '../types/catalog.types';

const ERROR_MESSAGES: Record<CatalogRequestErrorCode, string> = {
  [CATALOG_REQUEST_ERROR_CODES.REQUEST_UNAUTHORIZED]: CATALOG_STRINGS.unauthorized,
  [CATALOG_REQUEST_ERROR_CODES.REQUEST_FORBIDDEN]: CATALOG_STRINGS.forbidden,
  [CATALOG_REQUEST_ERROR_CODES.INVALID_RESPONSE]: CATALOG_STRINGS.invalidResponse,
  [CATALOG_REQUEST_ERROR_CODES.PRODUCTS_FETCH_FAILED]: CATALOG_STRINGS.errorFallback,
};

export function getCatalogErrorMessage(error: unknown): string {
  if (error instanceof CatalogRequestError) {
    return ERROR_MESSAGES[error.code] ?? CATALOG_STRINGS.errorFallback;
  }

  return CATALOG_STRINGS.errorFallback;
}
