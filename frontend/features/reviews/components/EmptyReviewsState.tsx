import { MessageSquare } from 'lucide-react';
import { PRODUCT_REVIEW_STRINGS } from '../constants/product-reviews.constants';
import type { EmptyReviewsStateProps } from '../types/product-reviews.types';

export function EmptyReviewsState({ filtered = false }: EmptyReviewsStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-foreground/20 px-4 py-12 text-center">
      <MessageSquare className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">
        {filtered
          ? PRODUCT_REVIEW_STRINGS.noReviewsForFilter
          : PRODUCT_REVIEW_STRINGS.noReviews}
      </p>
    </div>
  );
}
