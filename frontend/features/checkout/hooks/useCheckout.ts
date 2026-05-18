'use client';

import { useState, useCallback } from 'react';
import { submitCheckout } from '../api/checkout.api';
import { translateCheckoutError } from '../utils/checkout-error.utils';
import type { CheckoutPayload } from '../types/checkout.types';

export interface UseCheckoutResult {
  enviando: boolean;
  error: string | null;
  submit: (payload: CheckoutPayload) => Promise<string | null>;
}

export function useCheckout(): UseCheckoutResult {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (payload: CheckoutPayload): Promise<string | null> => {
    setEnviando(true);
    setError(null);

    try {
      const { orderId } = await submitCheckout(payload);
      return orderId;
    } catch (err: unknown) {
      setError(translateCheckoutError(err));
      return null;
    } finally {
      setEnviando(false);
    }
  }, []);

  return { enviando, error, submit };
}
