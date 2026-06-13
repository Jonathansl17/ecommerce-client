'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes.constants';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { addCartItem } from '@/features/cart/api/cart.api';
import {
  CATALOG_STRINGS,
  CATALOG_IMAGE_FALLBACK_ALT,
  CART_ADDED_EVENT,
} from '../constants/catalog.constants';
import type { CatalogProduct, CatalogVariant } from '../types/catalog.types';

interface ProductCardProps {
  product: CatalogProduct;
  cartVariantIds?: ReadonlySet<string>;
}

const QUICK_BUY_QUANTITY = 1;
const ADDED_FEEDBACK_MS = 2000;

function pickFirstAvailableVariant(
  variants: CatalogVariant[],
): CatalogVariant | null {
  return (
    variants.find((v) => v.currentStock - v.reservedStock >= QUICK_BUY_QUANTITY) ??
    null
  );
}

export function ProductCard({ product, cartVariantIds }: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [ejecutando, setEjecutando] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const availableVariant = pickFirstAvailableVariant(product.variants);
  const outOfStock = availableVariant == null;
  const inCart =
    isAuthenticated &&
    cartVariantIds != null &&
    product.variants.some((v) => cartVariantIds.has(v.id));

  const handleBuy = async () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }
    if (availableVariant == null) return;
    setEjecutando(true);
    try {
      await addCartItem({
        variantId: Number(availableVariant.id),
        quantity: QUICK_BUY_QUANTITY,
      });
      setAgregado(true);
      window.setTimeout(() => setAgregado(false), ADDED_FEEDBACK_MS);
      window.dispatchEvent(
        new CustomEvent(CART_ADDED_EVENT, {
          detail: { productName: product.name },
        }),
      );
    } finally {
      setEjecutando(false);
    }
  };

  const buyLabel = ejecutando
    ? CATALOG_STRINGS.buying
    : agregado
      ? CATALOG_STRINGS.added
      : outOfStock
        ? CATALOG_STRINGS.outOfStock
        : inCart
          ? CATALOG_STRINGS.alreadyInCart
          : CATALOG_STRINGS.buy;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="relative w-full h-48 bg-slate-100">
        {product.imageUrl != null ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            {CATALOG_IMAGE_FALLBACK_ALT}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            {product.categoryName}
          </p>
          <h2 className="mt-1 text-base font-semibold text-slate-950 leading-snug">
            {product.name}
          </h2>
        </div>

        <p className="text-sm font-bold text-slate-950">
          <span className="font-normal text-slate-500 mr-1">
            {CATALOG_STRINGS.priceFrom}
          </span>
          ₡{product.priceFrom.toLocaleString('es-CR')}
        </p>

        <div className="flex items-center gap-2">
          {inCart ? (
            <Link
              href={ROUTES.CART}
              className="inline-flex flex-1 items-center justify-center rounded-md bg-success px-3 py-1.5 text-sm font-medium text-success-foreground transition-opacity hover:opacity-90"
            >
              {buyLabel}
            </Link>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleBuy}
              disabled={ejecutando || outOfStock}
              className="flex-1"
            >
              {buyLabel}
            </Button>
          )}

          <Link
            href={ROUTES.PRODUCT_DETAIL(product.itemId)}
            className="inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {CATALOG_STRINGS.viewDetail}
          </Link>
        </div>
      </div>
    </article>
  );
}
