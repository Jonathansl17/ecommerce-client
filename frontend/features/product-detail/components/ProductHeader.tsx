'use client';

import { StarRatingDisplay } from '@/features/reviews/components/StarRatingDisplay';
import { PRODUCT_DETAIL_CURRENCY, PRODUCT_DETAIL_STRINGS } from '../constants/product-detail.constants';
import type { ProductHeaderProps } from '../types/product-detail.types';
import type { ReviewRating } from '@/features/reviews/types/reviews.types';

function formatPrice(price: number): string {
  return new Intl.NumberFormat(PRODUCT_DETAIL_CURRENCY.LOCALE, {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductHeader({
  name,
  categoryName,
  selectedVariant,
  priceFrom,
  ratingsSummary,
}: ProductHeaderProps) {
  const displayPrice = selectedVariant?.price ?? priceFrom;
  const showFromLabel = selectedVariant === null;

  return (
    <div className="flex flex-col gap-3">
      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
        {categoryName}
      </span>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{name}</h1>

      <div className="flex items-baseline gap-2">
        {showFromLabel && (
          <span className="text-sm text-slate-500">{PRODUCT_DETAIL_STRINGS.priceFrom}</span>
        )}
        <span className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          {formatPrice(displayPrice)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {ratingsSummary ? (
          <>
            <StarRatingDisplay
              value={Math.min(5, Math.max(1, Math.round(ratingsSummary.average))) as ReviewRating}
              size="sm"
            />
            <span className="text-sm text-slate-500">
              {PRODUCT_DETAIL_STRINGS.ratingLabel(
                ratingsSummary.average,
                ratingsSummary.totalReviews,
              )}
            </span>
          </>
        ) : (
          <span className="text-sm text-slate-400">{PRODUCT_DETAIL_STRINGS.noRatings}</span>
        )}
      </div>
    </div>
  );
}
