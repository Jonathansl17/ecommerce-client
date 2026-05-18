'use client';

import { useEffect, useMemo } from 'react';
import { CATALOG_STRINGS, CART_ADDED_EVENT } from '@/features/catalog/constants/catalog.constants';
import { useCatalogProducts } from '@/features/catalog/hooks/useCatalogProducts';
import { CatalogGrid } from '@/features/catalog/components/CatalogGrid';
import { EmptyCatalog } from '@/features/catalog/components/EmptyCatalog';
import { CartAddedToast } from '@/features/catalog/components/CartAddedToast';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useCart } from '@/features/cart/hooks/useCart';

export default function CatalogoPage() {
  const { productos, cargando, error } = useCatalogProducts();
  const { isAuthenticated } = useAuth();
  const { cart, recargar } = useCart();

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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-950">
          {CATALOG_STRINGS.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          {CATALOG_STRINGS.subtitle}
        </p>
      </header>

      {cargando && (
        <p className="text-sm text-slate-600">{CATALOG_STRINGS.loading}</p>
      )}

      {!cargando && error != null && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {!cargando && error == null && productos.length === 0 && (
        <EmptyCatalog />
      )}

      {!cargando && error == null && productos.length > 0 && (
        <CatalogGrid products={productos} cartVariantIds={cartVariantIds} />
      )}

      <CartAddedToast />
    </div>
  );
}
