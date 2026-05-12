import { StarRatingDisplay } from '@/features/reviews/components/StarRatingDisplay';
import { ReviewVotes } from '@/features/reviews/components/ReviewVotes';
import { VerifiedBuyerBadge } from '@/features/reviews/components/VerifiedBuyerBadge';
import { AuthorAvatar } from './AuthorAvatar';
import {
  PRODUCT_REVIEW_STRINGS,
  PRODUCT_REVIEW_DATE_FORMAT,
} from '../constants/product-reviews.constants';
import type { VoteType } from '../types/reviews.types';
import type { PublicReviewCardProps } from '../types/product-reviews.types';

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(
    PRODUCT_REVIEW_DATE_FORMAT.LOCALE,
    PRODUCT_REVIEW_DATE_FORMAT.OPTIONS,
  );
}

export function PublicReviewCard({
  review,
  currentUserVote = null,
  isOwnReview = false,
  isAuthenticated = false,
  onVote,
}: PublicReviewCardProps) {
  const dateLabel = PRODUCT_REVIEW_STRINGS.reviewedOn(
    formatDate(review.edited ? review.updatedAt : review.createdAt),
  );

  const handleVote = onVote
    ? (voteType: VoteType) => onVote(review.id, voteType)
    : undefined;

  return (
    <article className="rounded-md border border-foreground/10 bg-muted/30 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <AuthorAvatar name={review.clientUserName} />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              {review.clientUserName}
            </p>
            <VerifiedBuyerBadge />
          </div>
          <p className="text-xs text-muted-foreground">
            {dateLabel}
            {review.edited ? ` · ${PRODUCT_REVIEW_STRINGS.editedTag}` : ''}
          </p>
        </div>
        <StarRatingDisplay value={review.rating} size="sm" />
      </div>

      <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
        {review.comment}
      </p>

      <ReviewVotes
        helpfulVotes={review.helpfulVotes}
        unhelpfulVotes={review.unhelpfulVotes}
        currentUserVote={currentUserVote}
        isOwnReview={isOwnReview}
        isAuthenticated={isAuthenticated}
        onVote={handleVote}
      />
    </article>
  );
}
