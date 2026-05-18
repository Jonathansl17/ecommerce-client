'use client';

import Image from 'next/image';
import { PRODUCT_DETAIL_STRINGS } from '../constants/product-detail.constants';
import type { ProductImageProps } from '../types/product-detail.types';

export function ProductImage({ imageUrl, productName }: ProductImageProps) {
  if (!imageUrl) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-100">
        <span className="text-sm text-slate-400">{PRODUCT_DETAIL_STRINGS.noImage}</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <Image
        src={imageUrl}
        alt={PRODUCT_DETAIL_STRINGS.imageAlt(productName)}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
    </div>
  );
}
