import type { CATALOG_REQUEST_ERROR_CODES } from '../constants/catalog.constants';

export type CatalogRequestErrorCode =
  (typeof CATALOG_REQUEST_ERROR_CODES)[keyof typeof CATALOG_REQUEST_ERROR_CODES];

export interface RawCatalogVariant {
  id: string;
  color: string;
  size: string;
  price: number | string;
  currentStock: number;
  minThreshold: number;
  reservedStock: number;
}

export interface RawCatalogProduct {
  itemId: string;
  categoryId: string;
  description: string;
  imageUrl: string | null;
  type: 'standard' | 'custom';
  item: {
    name: string;
    status: string;
  };
  category: {
    id: string;
    name: string;
  };
  variants: RawCatalogVariant[];
  ratingsSummary: {
    average: number | string;
    totalReviews: number;
  } | null;
}

export interface CatalogVariant {
  id: string;
  color: string;
  size: string;
  price: number;
  currentStock: number;
  minThreshold: number;
  reservedStock: number;
}

export interface CatalogProduct {
  itemId: string;
  categoryId: string;
  description: string;
  imageUrl: string | null;
  type: 'standard' | 'custom';
  name: string;
  categoryName: string;
  variants: CatalogVariant[];
  priceFrom: number;
  ratingsSummary: {
    average: number;
    totalReviews: number;
  } | null;
}

export interface UseCatalogProductsResult {
  productos: CatalogProduct[];
  cargando: boolean;
  error: string | null;
}

export interface CatalogAsyncState<TData> {
  data: TData;
  cargando: boolean;
  error: string | null;
}

export interface UseCatalogRequestOptions<TData> {
  requestKey: string;
  enabled?: boolean;
  initialData: TData;
  getErrorMessage: (error: unknown) => string;
  request: (context: { signal: AbortSignal }) => Promise<TData>;
}

export interface CatalogResolvedState<TData> {
  requestKey: string;
  data: TData;
  error: string | null;
  status: 'idle' | 'success' | 'error';
}
