import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/lib/constants/routes.constants';
import { CATALOG_STRINGS, CATALOG_IMAGE_FALLBACK_ALT } from '../constants/catalog.constants';
import type { CatalogProduct } from '../types/catalog.types';

interface ProductCardProps {
  product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
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

        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-slate-950">
            <span className="font-normal text-slate-500 mr-1">{CATALOG_STRINGS.priceFrom}</span>
            ₡{product.priceFrom.toLocaleString('es-CR')}
          </p>

          <Link
            href={ROUTES.PRODUCT_DETAIL(product.itemId)}
            className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            {CATALOG_STRINGS.viewDetail}
          </Link>
        </div>
      </div>
    </article>
  );
}
