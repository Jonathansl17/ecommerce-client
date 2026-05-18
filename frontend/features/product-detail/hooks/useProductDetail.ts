'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProductDetail } from '../api/product-detail.api';
import { getProductDetailErrorMessage } from '../utils/product-detail-error.utils';
import type { ProductDetail, UseProductDetailResult } from '../types/product-detail.types';

export function useProductDetail(id: string): UseProductDetailResult & { recargar: () => void } {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recargarRef = useRef(0);

  const recargar = useCallback(() => {
    recargarRef.current += 1;
  }, []);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    setCargando(true);
    setError(null);

    fetchProductDetail(id, { signal: controller.signal })
      .then((data) => {
        setProduct(data);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(getProductDetailErrorMessage(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      });

    return () => {
      controller.abort();
    };
    // recargarRef.current triggers re-fetch without stale closure issues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, recargarRef.current]);

  return { product, cargando, error, recargar };
}
