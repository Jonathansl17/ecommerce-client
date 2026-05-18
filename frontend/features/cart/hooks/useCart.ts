'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchCart } from '../api/cart.api';
import { resolveCartFetchError } from '../utils/cart-error.utils';
import type { Cart, UseCartResult } from '../types/cart.types';

export function useCart(): UseCartResult {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cargar = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setCargando(true);
    setError(null);

    try {
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(resolveCartFetchError(err));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    return () => {
      abortRef.current?.abort();
    };
  }, [cargar]);

  return { cart, cargando, error, recargar: cargar };
}
