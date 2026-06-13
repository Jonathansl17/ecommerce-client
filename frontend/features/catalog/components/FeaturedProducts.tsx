'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/lib/constants/routes.constants';
import { CATALOG_STRINGS, CATALOG_IMAGE_FALLBACK_ALT } from '../constants/catalog.constants';
import { useCatalogProducts } from '../hooks/useCatalogProducts';

const FEATURED_COUNT = 4;

export function FeaturedProducts() {
  const { productos, cargando } = useCatalogProducts();
  const featured = productos.slice(0, FEATURED_COUNT);

  if (cargando) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: FEATURED_COUNT }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-foreground/10 bg-background p-4 space-y-3"
          >
            <div className="aspect-square animate-pulse rounded-md bg-foreground/5" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-foreground/5" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-foreground/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (featured.length === 0) return null;

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {featured.map((product) => (
        <Link
          key={product.itemId}
          href={ROUTES.PRODUCT_DETAIL(product.itemId)}
          className="group rounded-lg border border-foreground/10 bg-background p-4 space-y-3 transition-colors hover:border-foreground/30"
        >
          <div className="relative aspect-square overflow-hidden rounded-md bg-foreground/5">
            {product.imageUrl != null ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-foreground/40">
                {CATALOG_IMAGE_FALLBACK_ALT}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground line-clamp-1">{product.name}</p>
            <p className="text-sm font-bold text-foreground/80">
              <span className="mr-1 font-normal text-foreground/50">{CATALOG_STRINGS.priceFrom}</span>
              ₡{product.priceFrom.toLocaleString('es-CR')}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
