import type { CART_ERROR_CODES } from '../constants/cart.constants';

export type CartErrorCode = (typeof CART_ERROR_CODES)[keyof typeof CART_ERROR_CODES];

export interface CartItemVariantProduct {
  itemId: string;
  imageUrl: string | null;
  item: {
    name: string;
  };
}

export interface CartItemVariant {
  color: string | null;
  size: string | null;
  price: string;
  currentStock: number;
  reservedStock: number;
  product: CartItemVariantProduct;
}

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  unitPriceSnap: string;
  variant: CartItemVariant;
}

export interface Cart {
  id: string;
  status: string;
  items: CartItem[];
  subtotal: string;
  taxes: string;
  total: string;
}

export interface CartResponse {
  cart: Cart;
}

export interface AddCartItemBody {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemBody {
  quantity: number;
}

// Hook return types

export interface UseCartResult {
  cart: Cart | null;
  cargando: boolean;
  error: string | null;
  recargar: () => void;
}

export interface UseCartMutationsResult {
  agregarItem: (variantId: number, quantity: number) => Promise<void>;
  actualizarCantidad: (itemId: string, quantity: number) => Promise<void>;
  eliminarItem: (itemId: string) => Promise<void>;
  ejecutando: boolean;
  error: string | null;
}

// Component prop types

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  ejecutando: boolean;
}

export interface CartSummaryProps {
  subtotal: number;
  taxes: number;
  total: number;
}

export interface EmptyCartProps {
  onGoToCatalog?: () => void;
}
