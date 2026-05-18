'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
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
  deleting,
  onStartEditing,
  onCancel,
  onSubmit,
  onDelete,
}: PurchasedProductCardProps) {
  const { product, review } = item;
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const isEditingExisting = isEditing && review !== null;
  const submitLabel = isEditingExisting ? REVIEW_STRINGS.update : REVIEW_STRINGS.submit;
  const submittingLabel = isEditingExisting
    ? REVIEW_STRINGS.updating
    : REVIEW_STRINGS.submitting;

  const handleConfirmDelete = async () => {
    try {
      await onDelete();
    } finally {
      setConfirmingDelete(false);
    }
  };

  return (
    <article className="rounded-lg border border-foreground/10 bg-background p-5 space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-4">
          {product.imageUrl ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-foreground/5">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 shrink-0 rounded-md bg-foreground/5" aria-hidden="true" />
          )}
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground">
              {product.variant.color} · {product.variant.size}
            </p>
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
        <ReviewCard
          review={review}
          onEdit={onStartEditing}
          onDelete={() => setConfirmingDelete(true)}
        />
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

      <ConfirmDialog
        open={confirmingDelete}
        title={REVIEW_STRINGS.deleteDialogTitle}
        message={REVIEW_STRINGS.deleteDialogMessage}
        confirmLabel={deleting ? REVIEW_STRINGS.deleting : REVIEW_STRINGS.deleteDialogConfirm}
        cancelLabel={REVIEW_STRINGS.deleteDialogCancel}
        loading={deleting}
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </article>
  );
}
