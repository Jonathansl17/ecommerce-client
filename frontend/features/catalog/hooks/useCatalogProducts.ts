'use client';

import { useCallback } from 'react';
import { CATALOG_API_STRINGS } from '../constants/catalog.constants';
import { fetchCatalogProducts } from '../api/catalog.api';
import type { CatalogProduct, UseCatalogProductsResult } from '../types/catalog.types';
import { getCatalogErrorMessage } from '../utils/catalog-error.utils';
import { useCatalogRequest } from './useCatalogRequest';

const EMPTY_PRODUCTS: CatalogProduct[] = [];

export function useCatalogProducts(): UseCatalogProductsResult {
  const request = useCallback(
    ({ signal }: { signal: AbortSignal }) => fetchCatalogProducts({ signal }),
    [],
  );

  const getErrorMessage = useCallback(
    (error: unknown) => getCatalogErrorMessage(error),
    [],
  );

  const { data, cargando, error } = useCatalogRequest({
    requestKey: CATALOG_API_STRINGS.productsRequestKey,
    initialData: EMPTY_PRODUCTS,
    getErrorMessage,
    request,
  });

  return {
    productos: data,
    cargando,
    error,
  };
}
