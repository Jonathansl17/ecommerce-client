'use client';

import { useCallback, useState } from 'react';
import { addCartItem } from '@/features/cart/api/cart.api';
import { PRODUCT_DETAIL_STRINGS } from '../constants/product-detail.constants';
import type { UseAddToCartResult } from '../types/product-detail.types';

const SUCCESS_BANNER_MS = 4_000;

export function useAddToCart(): UseAddToCartResult {
  const [ejecutando, setEjecutando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const limpiarExito = useCallback(() => {
    setExito(false);
  }, []);

  const agregar = useCallback(async (variantId: string, quantity: number): Promise<void> => {
    setEjecutando(true);
    setError(null);
    setExito(false);

    try {
      await addCartItem({ variantId: Number(variantId), quantity });
      setExito(true);
      setTimeout(() => {
        setExito(false);
      }, SUCCESS_BANNER_MS);
    } catch {
      setError(PRODUCT_DETAIL_STRINGS.addError);
    } finally {
      setEjecutando(false);
    }
  }, []);

  return { agregar, ejecutando, error, exito, limpiarExito };
}
