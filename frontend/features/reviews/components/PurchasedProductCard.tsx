'use client';

import { Button } from '@/components/ui/Button';
import { REVIEW_STRINGS } from '../constants/reviews.constants';
import { formatReviewDate } from '../shared/formatDate';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { VerifiedBuyerBadge } from './VerifiedBuyerBadge';
import type { PurchasedProductCardProps } from '../types/reviews.types';

export function PurchasedProductCard({
  item,
  isEditing,
  submitting,
  onStartEditing,
  onCancel,
  onSubmit,
}: PurchasedProductCardProps) {
  const { product, review } = item;
  const isEditingExisting = isEditing && review !== null;
  const submitLabel = isEditingExisting ? REVIEW_STRINGS.update : REVIEW_STRINGS.submit;
  const submittingLabel = isEditingExisting
    ? REVIEW_STRINGS.updating
    : REVIEW_STRINGS.submitting;

  return (
    <article className="rounded-lg border border-foreground/10 bg-background p-5 space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-4">
          <div className="h-16 w-16 shrink-0 rounded-md bg-foreground/5" aria-hidden="true" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm font-medium text-foreground/80">{product.price}</p>
            <p className="text-xs text-muted-foreground">
              {REVIEW_STRINGS.purchasedOn(formatReviewDate(product.purchasedAt))}
            </p>
          </div>
        </div>
        <VerifiedBuyerBadge />
      </header>

      {isEditing ? (
        <ReviewForm
          initialData={
            review ? { rating: review.rating, comment: review.comment } : undefined
          }
          submitting={submitting}
          onCancel={onCancel}
          onSubmit={onSubmit}
          submitLabel={submitLabel}
          submittingLabel={submittingLabel}
        />
      ) : review ? (
        <ReviewCard review={review} onEdit={onStartEditing} />
      ) : (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={onStartEditing}
            className="sm:w-auto sm:px-5"
          >
            {REVIEW_STRINGS.writeReview}
          </Button>
        </div>
      )}
    </article>
  );
}
