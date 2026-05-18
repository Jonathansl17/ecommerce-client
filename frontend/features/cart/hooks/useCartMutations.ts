'use client';

import { useState, useCallback } from 'react';
import { addCartItem, updateCartItemQuantity, removeCartItem } from '../api/cart.api';
import { resolveCartMutationError } from '../utils/cart-error.utils';
import { CART_STRINGS } from '../constants/cart.constants';
import type { UseCartMutationsResult } from '../types/cart.types';

export function useCartMutations(onSuccess: () => void): UseCartMutationsResult {
  const [ejecutando, setEjecutando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutarMutacion = useCallback(
    async (accion: () => Promise<void>, fallback: string) => {
      setEjecutando(true);
      setError(null);
      try {
        await accion();
        onSuccess();
      } catch (err) {
        setError(resolveCartMutationError(err, fallback));
      } finally {
        setEjecutando(false);
      }
    },
    [onSuccess],
  );

  const agregarItem = useCallback(
    async (variantId: number, quantity: number) => {
      await ejecutarMutacion(
        () => addCartItem({ variantId, quantity }),
        CART_STRINGS.addError,
      );
    },
    [ejecutarMutacion],
  );

  const actualizarCantidad = useCallback(
    async (itemId: string, quantity: number) => {
      await ejecutarMutacion(
        () => updateCartItemQuantity(itemId, { quantity }),
        CART_STRINGS.updateError,
      );
    },
    [ejecutarMutacion],
  );

  const eliminarItem = useCallback(
    async (itemId: string) => {
      await ejecutarMutacion(
        () => removeCartItem(itemId),
        CART_STRINGS.removeError,
      );
    },
    [ejecutarMutacion],
  );

  return { agregarItem, actualizarCantidad, eliminarItem, ejecutando, error };
}
