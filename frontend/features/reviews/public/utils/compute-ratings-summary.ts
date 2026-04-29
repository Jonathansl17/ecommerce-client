import type { ProductReview, RatingsSummary } from '@/features/reviews/types/reviews.types';

type StarKey = 'stars1' | 'stars2' | 'stars3' | 'stars4' | 'stars5';

function emptySummary(productId: string): RatingsSummary {
  return {
    productId,
    average: 0,
    totalReviews: 0,
    stars1: 0,
    stars2: 0,
    stars3: 0,
    stars4: 0,
    stars5: 0,
  };
}

export function computeRatingsSummary(
  productId: string,
  reviews: ProductReview[],
): RatingsSummary {
  const totalReviews = reviews.length;
  if (totalReviews === 0) return emptySummary(productId);

  const totalScore = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = Math.round((totalScore / totalReviews) * 10) / 10;

  const distribution = reviews.reduce(
    (acc, r) => {
      const key = `stars${r.rating}` as StarKey;
      acc[key] += 1;
      return acc;
    },
    { stars1: 0, stars2: 0, stars3: 0, stars4: 0, stars5: 0 },
  );

  return { productId, average, totalReviews, ...distribution };
}
