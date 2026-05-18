import { PRODUCT_DETAIL_REQUEST_ERROR_CODES, PRODUCT_DETAIL_STRINGS } from '../constants/product-detail.constants';
import { ProductDetailRequestError } from '../api/product-detail.api';
import type { ProductDetailErrorCode } from '../types/product-detail.types';

const ERROR_MESSAGES: Record<ProductDetailErrorCode, string> = {
  [PRODUCT_DETAIL_REQUEST_ERROR_CODES.NOT_FOUND]: PRODUCT_DETAIL_STRINGS.notFound,
  [PRODUCT_DETAIL_REQUEST_ERROR_CODES.FETCH_FAILED]: PRODUCT_DETAIL_STRINGS.errorFallback,
  [PRODUCT_DETAIL_REQUEST_ERROR_CODES.INVALID_RESPONSE]: PRODUCT_DETAIL_STRINGS.errorFallback,
};

export function getProductDetailErrorMessage(error: unknown): string {
  if (error instanceof ProductDetailRequestError) {
    return ERROR_MESSAGES[error.code] ?? PRODUCT_DETAIL_STRINGS.errorFallback;
  }
  return PRODUCT_DETAIL_STRINGS.errorFallback;
}
