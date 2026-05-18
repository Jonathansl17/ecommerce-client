'use client';

import { useCallback, useState } from 'react';
import { cancelOrder } from '../api/orders.api';
import { translateCancelOrderError } from '../utils/orders-error.utils';

export interface UseCancelOrderResult {
  cancelando: boolean;
  error: string | null;
  cancelar: (orderId: string) => Promise<boolean>;
}

export function useCancelOrder(): UseCancelOrderResult {
  const [cancelando, setCancelando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelar = useCallback(async (orderId: string): Promise<boolean> => {
    if (cancelando) return false;

    setCancelando(true);
    setError(null);

    try {
      await cancelOrder(orderId);
      return true;
    } catch (err) {
      setError(translateCancelOrderError(err));
      return false;
    } finally {
      setCancelando(false);
    }
  }, [cancelando]);

  return { cancelando, error, cancelar };
}
