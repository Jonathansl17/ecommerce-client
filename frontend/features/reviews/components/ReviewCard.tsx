import { REVIEW_STRINGS } from '../constants/reviews.constants';
import { formatReviewDate } from '../shared/formatDate';
import { StarRatingDisplay } from './StarRatingDisplay';
import { ReviewVotes } from './ReviewVotes';
import type { ReviewCardProps } from '../types/reviews.types';

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  return (
    <div className="rounded-md border border-foreground/10 bg-muted/30 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{review.clientUserName}</p>
          <p className="text-xs text-muted-foreground">
            {REVIEW_STRINGS.reviewedOn(formatReviewDate(review.updatedAt))}
            {review.edited ? ` · ${REVIEW_STRINGS.editedTag}` : ''}
          </p>
          {review.status === 'pending' && (
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {REVIEW_STRINGS.pendingModeration}
            </p>
          )}
        </div>
        <StarRatingDisplay value={review.rating} />
      </div>
      <p className="text-sm text-foreground/90 whitespace-pre-wrap">{review.comment}</p>
      <div className="flex items-center justify-between gap-3">
        <ReviewVotes
          helpfulVotes={review.helpfulVotes}
          unhelpfulVotes={review.unhelpfulVotes}
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium text-foreground underline hover:opacity-80"
          >
            {REVIEW_STRINGS.editReview}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-sm font-medium text-destructive underline hover:opacity-80"
          >
            {REVIEW_STRINGS.deleteReview}
          </button>
        </div>
      </div>
    </div>
  );
}
