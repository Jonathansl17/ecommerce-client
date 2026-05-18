import { apiFetch } from '@/lib/http/apiFetch';
import { CART_API_PATHS, CART_STRINGS } from '../constants/cart.constants';
import type { Cart, AddCartItemBody, UpdateCartItemBody } from '../types/cart.types';

function parseCartDecimals(cart: Cart): Cart {
  return {
    ...cart,
    subtotal: Number(cart.subtotal).toFixed(2),
    taxes: Number(cart.taxes).toFixed(2),
    total: Number(cart.total).toFixed(2),
    items: cart.items.map((item) => ({
      ...item,
      id: String(item.id),
      variantId: String(item.variantId),
      unitPriceSnap: Number(item.unitPriceSnap).toFixed(2),
      variant: {
        ...item.variant,
        price: Number(item.variant.price).toFixed(2),
        product: {
          ...item.variant.product,
          itemId: String(item.variant.product.itemId),
        },
      },
    })),
  };
}

export async function fetchCart(): Promise<Cart> {
  try {
    const response = await apiFetch<Cart>(CART_API_PATHS.CART);
    return parseCartDecimals(response);
  } catch {
    throw new Error(CART_STRINGS.fetchError);
  }
}

export async function addCartItem(body: AddCartItemBody): Promise<void> {
  try {
    await apiFetch(CART_API_PATHS.CART_ITEMS, {
      method: 'POST',
      body: body as unknown as Record<string, unknown>,
    });
  } catch {
    throw new Error(CART_STRINGS.addError);
  }
}

export async function updateCartItemQuantity(
  itemId: string,
  body: UpdateCartItemBody,
): Promise<void> {
  try {
    await apiFetch(CART_API_PATHS.CART_ITEM(itemId), {
      method: 'PUT',
      body: body as unknown as Record<string, unknown>,
    });
  } catch {
    throw new Error(CART_STRINGS.updateError);
  }
}

export async function removeCartItem(itemId: string): Promise<void> {
  try {
    await apiFetch(CART_API_PATHS.CART_ITEM(itemId), {
      method: 'DELETE',
    });
  } catch {
    throw new Error(CART_STRINGS.removeError);
  }
}
