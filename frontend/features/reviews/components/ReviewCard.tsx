import { REVIEW_STRINGS } from '../constants/reviews.constants';
import { formatReviewDate } from '../shared/formatDate';
import { StarRatingDisplay } from './StarRatingDisplay';
import type { ReviewCardProps } from '../types/reviews.types';

export function ReviewCard({ review, onEdit }: ReviewCardProps) {
  return (
    <div className="rounded-md border border-foreground/10 bg-muted/30 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{review.userName}</p>
          <p className="text-xs text-muted-foreground">
            {REVIEW_STRINGS.reviewedOn(formatReviewDate(review.updatedAt))}
          </p>
        </div>
        <StarRatingDisplay value={review.rating} />
      </div>
      <p className="text-sm text-foreground/90 whitespace-pre-wrap">{review.comment}</p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-foreground underline hover:opacity-80"
        >
          {REVIEW_STRINGS.editReview}
        </button>
      </div>
    </div>
  );
}
