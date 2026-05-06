'use client';

import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useProductReviews } from '../hooks/useProductReviews';
import { ProductRatingsHeader } from './ProductRatingsHeader';
import { ReviewFiltersBar } from './ReviewFiltersBar';
import { PublicReviewCard } from './PublicReviewCard';
import { EmptyReviewsState } from './EmptyReviewsState';
import { PRODUCT_REVIEW_STRINGS } from '../constants/product-reviews.constants';
import { Pagination } from '@/components/ui/Pagination';
import type {
  DateFilter,
  HelpfulFilter,
  ProductReviewsSectionProps,
  RatingFilter,
} from '../types/product-reviews.types';

function ReviewsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-md border border-foreground/10 bg-muted/30"
        />
      ))}
    </div>
  );
}

export function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const {
    summary,
    reviews,
    pagination,
    myVotes,
    loading,
    error,
    filters,
    dispatch,
    vote,
  } = useProductReviews(productId);

  const hasRawReviews = summary.totalReviews > 0;
  const isFiltered = filters.rating !== 'all';

  return (
    <section aria-labelledby="reviews-heading" className="space-y-6">
      <h2
        id="reviews-heading"
        className="text-2xl font-bold text-foreground"
      >
        {PRODUCT_REVIEW_STRINGS.sectionTitle}
      </h2>

      {loading && (
        <>
          <div className="h-28 animate-pulse rounded-lg border border-foreground/10 bg-muted/20" />
          <ReviewsSkeleton />
          <p className="sr-only">{PRODUCT_REVIEW_STRINGS.loading}</p>
        </>
      )}

      {!loading && error && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {PRODUCT_REVIEW_STRINGS.loadError}
        </p>
      )}

      {!loading && !error && (
        <>
          <ProductRatingsHeader summary={summary} />

          {hasRawReviews && (
            <ReviewFiltersBar
              filters={filters}
              onDateChange={(value: DateFilter) =>
                dispatch({ type: 'SET_DATE', payload: value })
              }
              onRatingChange={(value: RatingFilter) =>
                dispatch({ type: 'SET_RATING', payload: value })
              }
              onHelpfulChange={(value: HelpfulFilter) =>
                dispatch({ type: 'SET_HELPFUL', payload: value })
              }
            />
          )}

          {reviews.length === 0 ? (
            <EmptyReviewsState filtered={isFiltered} />
          ) : (
            <>
              <ul className="space-y-4" aria-label={PRODUCT_REVIEW_STRINGS.sectionTitle}>
                {reviews.map((review) => (
                  <li key={review.id}>
                    <PublicReviewCard
                      review={review}
                      currentUserVote={myVotes[review.id] ?? null}
                      isOwnReview={user?.id === review.clientUserId}
                      isAuthenticated={isAuthenticated}
                      onVote={vote}
                    />
                  </li>
                ))}
              </ul>

              <Pagination
                page={pagination.page}
                limit={pagination.limit}
                total={pagination.total}
                itemLabelSingular="reseña"
                itemLabelPlural="reseñas"
                onPageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
                disabled={loading}
              />
            </>
          )}
        </>
      )}
    </section>
  );
}
