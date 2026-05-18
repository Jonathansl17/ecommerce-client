import type { PRODUCT_DETAIL_REQUEST_ERROR_CODES } from '../constants/product-detail.constants';

export type ProductDetailErrorCode =
  (typeof PRODUCT_DETAIL_REQUEST_ERROR_CODES)[keyof typeof PRODUCT_DETAIL_REQUEST_ERROR_CODES];

// Raw shapes from API (Decimal fields arrive as strings after BigInt JSON serialization)
export interface RawProductDetailVariant {
  id: string;
  color: string;
  size: string;
  price: string | number;
  currentStock: number;
  minThreshold: number;
  reservedStock: number;
}

export interface RawProductDetail {
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
  variants: RawProductDetailVariant[];
  ratingsSummary: {
    average: string | number;
    totalReviews: number;
  } | null;
}

// Normalized domain types
export interface ProductDetailVariant {
  id: string;
  color: string;
  size: string;
  price: number;
  currentStock: number;
  minThreshold: number;
  reservedStock: number;
}

export interface ProductDetail {
  itemId: string;
  categoryId: string;
  description: string;
  imageUrl: string | null;
  type: 'standard' | 'custom';
  name: string;
  status: string;
  categoryName: string;
  variants: ProductDetailVariant[];
  priceFrom: number;
  ratingsSummary: {
    average: number;
    totalReviews: number;
  } | null;
}

// Hook result types
export interface UseProductDetailResult {
  product: ProductDetail | null;
  cargando: boolean;
  error: string | null;
}

export interface UseAddToCartResult {
  agregar: (variantId: string, quantity: number) => Promise<void>;
  ejecutando: boolean;
  error: string | null;
  exito: boolean;
  limpiarExito: () => void;
}

// Component prop types
export interface ProductImageProps {
  imageUrl: string | null;
  productName: string;
}

export interface ProductHeaderProps {
  name: string;
  categoryName: string;
  selectedVariant: ProductDetailVariant | null;
  priceFrom: number;
  ratingsSummary: ProductDetail['ratingsSummary'];
}

export interface ProductDescriptionProps {
  description: string;
  type: 'standard' | 'custom';
}

export interface VariantSelectorProps {
  variants: ProductDetailVariant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
}

export interface AddToCartFormProps {
  variants: ProductDetailVariant[];
}
