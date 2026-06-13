'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { CATALOG_STRINGS, CART_ADDED_EVENT } from '@/features/catalog/constants/catalog.constants';
import { useCatalogProducts } from '@/features/catalog/hooks/useCatalogProducts';
import { CatalogGrid } from '@/features/catalog/components/CatalogGrid';
import { EmptyCatalog } from '@/features/catalog/components/EmptyCatalog';
import { CartAddedToast } from '@/features/catalog/components/CartAddedToast';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useCart } from '@/features/cart/hooks/useCart';
import type { CatalogProduct } from '@/features/catalog/types/catalog.types';

function matchesQuery(product: CatalogProduct, query: string): boolean {
  const haystack = `${product.name} ${product.categoryName} ${product.description}`.toLowerCase();
  return haystack.includes(query);
}

function matchesCategory(product: CatalogProduct, categoria: string): boolean {
  return product.categoryName.toLowerCase() === categoria;
}

function filterProducts(
  products: CatalogProduct[],
  query: string,
  categoria: string,
): CatalogProduct[] {
  return products.filter((p) => {
    if (query && !matchesQuery(p, query)) return false;
    if (categoria && !matchesCategory(p, categoria)) return false;
    return true;
  });
}

function CatalogoContent() {
  const { productos, cargando, error } = useCatalogProducts();
  const { isAuthenticated } = useAuth();
  const { cart, recargar } = useCart();
  const searchParams = useSearchParams();

  const query = (searchParams.get('q') ?? '').trim().toLowerCase();
  const categoria = (searchParams.get('categoria') ?? '').trim().toLowerCase();

  useEffect(() => {
    function onAdded() {
      recargar();
    }
    window.addEventListener(CART_ADDED_EVENT, onAdded);
    return () => window.removeEventListener(CART_ADDED_EVENT, onAdded);
  }, [recargar]);

  const cartVariantIds = useMemo(() => {
    if (!isAuthenticated || cart == null) return new Set<string>();
    return new Set(cart.items.map((item) => item.variantId));
  }, [isAuthenticated, cart]);

  const visibleProducts = useMemo(
    () => filterProducts(productos, query, categoria),
    [productos, query, categoria],
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-950">{CATALOG_STRINGS.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          {query
            ? `${CATALOG_STRINGS.searchResultsFor} "${searchParams.get('q')}"`
            : CATALOG_STRINGS.subtitle}
        </p>
      </header>

      {cargando && <p className="text-sm text-slate-600">{CATALOG_STRINGS.loading}</p>}

      {!cargando && error != null && <p className="text-sm text-red-600">{error}</p>}

      {!cargando && error == null && visibleProducts.length === 0 && <EmptyCatalog />}

      {!cargando && error == null && visibleProducts.length > 0 && (
        <CatalogGrid products={visibleProducts} cartVariantIds={cartVariantIds} />
      )}

      <CartAddedToast />
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={null}>
      <CatalogoContent />
    </Suspense>
  );
}
