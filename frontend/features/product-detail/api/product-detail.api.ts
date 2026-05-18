import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import {
  PRODUCT_DETAIL_API_PATHS,
  PRODUCT_DETAIL_REQUEST_ERROR_CODES,
} from '../constants/product-detail.constants';
import type {
  ProductDetail,
  ProductDetailVariant,
  ProductDetailErrorCode,
  RawProductDetail,
  RawProductDetailVariant,
} from '../types/product-detail.types';

export class ProductDetailRequestError extends Error {
  code: ProductDetailErrorCode;

  constructor(code: ProductDetailErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'ProductDetailRequestError';
  }
}

interface FetchOptions {
  signal?: AbortSignal;
}

// --- Type guards ---

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRawVariant(value: unknown): value is RawProductDetailVariant {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.color === 'string' &&
    typeof value.size === 'string' &&
    (typeof value.price === 'string' || typeof value.price === 'number') &&
    typeof value.currentStock === 'number' &&
    typeof value.minThreshold === 'number' &&
    typeof value.reservedStock === 'number'
  );
}

function isRawProductDetail(value: unknown): value is RawProductDetail {
  return (
    isRecord(value) &&
    typeof value.itemId === 'string' &&
    typeof value.categoryId === 'string' &&
    typeof value.description === 'string' &&
    (value.imageUrl == null || typeof value.imageUrl === 'string') &&
    (value.type === 'standard' || value.type === 'custom') &&
    isRecord(value.item) &&
    typeof value.item.name === 'string' &&
    typeof value.item.status === 'string' &&
    isRecord(value.category) &&
    typeof value.category.id === 'string' &&
    typeof value.category.name === 'string' &&
    Array.isArray(value.variants) &&
    value.variants.every(isRawVariant) &&
    (value.ratingsSummary == null ||
      (isRecord(value.ratingsSummary) &&
        (typeof value.ratingsSummary.average === 'string' ||
          typeof value.ratingsSummary.average === 'number') &&
        typeof value.ratingsSummary.totalReviews === 'number'))
  );
}

// --- Normalizers ---

function normalizeVariant(raw: RawProductDetailVariant): ProductDetailVariant {
  return {
    id: raw.id,
    color: raw.color,
    size: raw.size,
    price: typeof raw.price === 'string' ? parseFloat(raw.price) : raw.price,
    currentStock: raw.currentStock,
    minThreshold: raw.minThreshold,
    reservedStock: raw.reservedStock,
  };
}

function computePriceFrom(variants: ProductDetailVariant[]): number {
  if (variants.length === 0) return 0;
  return Math.min(...variants.map((v) => v.price));
}

function normalizeProductDetail(raw: RawProductDetail): ProductDetail {
  const variants = raw.variants.map(normalizeVariant);
  return {
    itemId: raw.itemId,
    categoryId: raw.categoryId,
    description: raw.description,
    imageUrl: raw.imageUrl,
    type: raw.type,
    name: raw.item.name,
    status: raw.item.status,
    categoryName: raw.category.name,
    variants,
    priceFrom: computePriceFrom(variants),
    ratingsSummary: raw.ratingsSummary
      ? {
          average:
            typeof raw.ratingsSummary.average === 'string'
              ? parseFloat(raw.ratingsSummary.average)
              : raw.ratingsSummary.average,
          totalReviews: raw.ratingsSummary.totalReviews,
        }
      : null,
  };
}

function buildRequestError(status: number): ProductDetailRequestError {
  if (status === 404) {
    return new ProductDetailRequestError(
      PRODUCT_DETAIL_REQUEST_ERROR_CODES.NOT_FOUND,
      'Producto no encontrado',
    );
  }
  return new ProductDetailRequestError(
    PRODUCT_DETAIL_REQUEST_ERROR_CODES.FETCH_FAILED,
    'No se pudo cargar el producto',
  );
}

// --- Public API ---

export async function fetchProductDetail(
  id: string,
  options?: FetchOptions,
): Promise<ProductDetail> {
  let payload: unknown;

  try {
    payload = await apiFetch<unknown>(PRODUCT_DETAIL_API_PATHS.product(id), {
      signal: options?.signal,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      throw buildRequestError(err.status);
    }
    throw err;
  }

  if (!isRawProductDetail(payload)) {
    throw new ProductDetailRequestError(
      PRODUCT_DETAIL_REQUEST_ERROR_CODES.INVALID_RESPONSE,
      'La respuesta del servidor no tiene el formato esperado',
    );
  }

  return normalizeProductDetail(payload);
}
