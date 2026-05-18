import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { CATALOG_API_PATHS, CATALOG_API_STRINGS, CATALOG_REQUEST_ERROR_CODES } from '../constants/catalog.constants';
import type {
  CatalogProduct,
  CatalogRequestErrorCode,
  RawCatalogProduct,
  RawCatalogVariant,
  CatalogVariant,
} from '../types/catalog.types';

export class CatalogRequestError extends Error {
  code: CatalogRequestErrorCode;

  constructor(code: CatalogRequestErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = CATALOG_API_STRINGS.errorName;
  }
}

interface CatalogRequestOptions {
  signal?: AbortSignal;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRawCatalogVariant(value: unknown): value is RawCatalogVariant {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.color === 'string' &&
    typeof value.size === 'string' &&
    (typeof value.price === 'number' || typeof value.price === 'string') &&
    typeof value.currentStock === 'number' &&
    typeof value.minThreshold === 'number' &&
    typeof value.reservedStock === 'number'
  );
}

function isRawCatalogProduct(value: unknown): value is RawCatalogProduct {
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
    value.variants.every(isRawCatalogVariant) &&
    (value.ratingsSummary == null ||
      (isRecord(value.ratingsSummary) &&
        typeof value.ratingsSummary.average === 'number' &&
        typeof value.ratingsSummary.totalReviews === 'number'))
  );
}

function assertCatalogProductsResponse(value: unknown): asserts value is RawCatalogProduct[] {
  if (!Array.isArray(value) || !value.every(isRawCatalogProduct)) {
    throw new CatalogRequestError(
      CATALOG_REQUEST_ERROR_CODES.INVALID_RESPONSE,
      CATALOG_API_STRINGS.invalidResponseShape,
    );
  }
}

function normalizeVariant(raw: RawCatalogVariant): CatalogVariant {
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

function computePriceFrom(variants: CatalogVariant[]): number {
  if (variants.length === 0) return 0;
  return Math.min(...variants.map((v) => v.price));
}

function normalizeProduct(raw: RawCatalogProduct): CatalogProduct {
  const variants = raw.variants.map(normalizeVariant);
  return {
    itemId: raw.itemId,
    categoryId: raw.categoryId,
    description: raw.description,
    imageUrl: raw.imageUrl,
    type: raw.type,
    name: raw.item.name,
    categoryName: raw.category.name,
    variants,
    priceFrom: computePriceFrom(variants),
    ratingsSummary: raw.ratingsSummary ?? null,
  };
}

function buildHttpError(
  status: number,
  fallbackCode: CatalogRequestErrorCode,
  fallbackMessage: string,
): CatalogRequestError {
  if (status === 401) {
    return new CatalogRequestError(
      CATALOG_REQUEST_ERROR_CODES.REQUEST_UNAUTHORIZED,
      CATALOG_API_STRINGS.requestUnauthorized,
    );
  }

  if (status === 403) {
    return new CatalogRequestError(
      CATALOG_REQUEST_ERROR_CODES.REQUEST_FORBIDDEN,
      CATALOG_API_STRINGS.requestForbidden,
    );
  }

  return new CatalogRequestError(fallbackCode, fallbackMessage);
}

async function executeCatalogRequest(
  endpoint: string,
  options?: CatalogRequestOptions,
): Promise<unknown> {
  try {
    return await apiFetch<unknown>(endpoint, { signal: options?.signal });
  } catch (err) {
    if (err instanceof ApiError) {
      throw buildHttpError(
        err.status,
        CATALOG_REQUEST_ERROR_CODES.PRODUCTS_FETCH_FAILED,
        CATALOG_API_STRINGS.fetchProductsFailed,
      );
    }
    throw err;
  }
}

export async function fetchCatalogProducts(
  options?: CatalogRequestOptions,
): Promise<CatalogProduct[]> {
  const payload = await executeCatalogRequest(CATALOG_API_PATHS.products, options);
  assertCatalogProductsResponse(payload);
  return payload.map(normalizeProduct);
}

export async function fetchCatalogProductsByCategory(
  categoryId: string,
  options?: CatalogRequestOptions,
): Promise<CatalogProduct[]> {
  const payload = await executeCatalogRequest(
    CATALOG_API_PATHS.productsByCategory(categoryId),
    options,
  );
  assertCatalogProductsResponse(payload);
  return payload.map(normalizeProduct);
}
