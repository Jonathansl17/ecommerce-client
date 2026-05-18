'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductReviewsSection } from '@/features/reviews/components/ProductReviewsSection';
import { PRODUCT_DETAIL_STRINGS } from '@/features/product-detail/constants/product-detail.constants';
import { useProductDetail } from '@/features/product-detail/hooks/useProductDetail';
import { ProductImage } from '@/features/product-detail/components/ProductImage';
import { ProductHeader } from '@/features/product-detail/components/ProductHeader';
import { ProductDescription } from '@/features/product-detail/components/ProductDescription';
import { AddToCartForm } from '@/features/product-detail/components/AddToCartForm';
import type { ProductDetailVariant } from '@/features/product-detail/types/product-detail.types';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { product, cargando, error, recargar } = useProductDetail(id);
  const [selectedVariant, setSelectedVariant] = useState<ProductDetailVariant | null>(null);

  if (cargando) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm text-slate-500">{PRODUCT_DETAIL_STRINGS.loading}</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button
            type="button"
            onClick={recargar}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm text-slate-500">{PRODUCT_DETAIL_STRINGS.notFound}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ProductImage imageUrl={product.imageUrl} productName={product.name} />

          <div className="flex flex-col gap-6">
            <ProductHeader
              name={product.name}
              categoryName={product.categoryName}
              selectedVariant={selectedVariant}
              priceFrom={product.priceFrom}
              ratingsSummary={product.ratingsSummary}
            />

            <ProductDescription description={product.description} type={product.type} />

            <AddToCartForm
              variants={product.variants}
              onVariantChange={setSelectedVariant}
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <ProductReviewsSection productId={id} />
      </div>
    </main>
  );
}
