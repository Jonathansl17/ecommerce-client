import type { ProductReview } from '@/features/reviews/types/reviews.types';
import type { ProductReviewFilters } from '../types/product-reviews.types';

function filterByRating(
  reviews: ProductReview[],
  rating: ProductReviewFilters['rating'],
): ProductReview[] {
  if (rating === 'all') return reviews;
  const ratingNum = Number(rating);
  return reviews.filter((r) => r.rating === ratingNum);
}

function sortByHelpfulness(reviews: ProductReview[]): ProductReview[] {
  return [...reviews].sort((a, b) => {
    if (b.helpfulVotes !== a.helpfulVotes) return b.helpfulVotes - a.helpfulVotes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function sortByDate(
  reviews: ProductReview[],
  date: ProductReviewFilters['date'],
): ProductReview[] {
  const dir = date === 'recent' ? -1 : 1;
  return [...reviews].sort(
    (a, b) =>
      dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  );
}

export function filterAndSortReviews(
  reviews: ProductReview[],
  filters: ProductReviewFilters,
): ProductReview[] {
  const filtered = filterByRating(reviews, filters.rating);
  return filters.helpful === 'most_helpful'
    ? sortByHelpfulness(filtered)
    : sortByDate(filtered, filters.date);
}
