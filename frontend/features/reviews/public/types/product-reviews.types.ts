import type { Dispatch } from 'react';
import type { ProductReview, RatingsSummary } from '@/features/reviews/types/reviews.types';

export type DateFilter = 'recent' | 'oldest';
export type RatingFilter = 'all' | '5' | '4' | '3' | '2' | '1';
export type HelpfulFilter = 'none' | 'most_helpful';

export interface ProductReviewFilters {
  date: DateFilter;
  rating: RatingFilter;
  helpful: HelpfulFilter;
}

export interface ProductReviewsState {
  rawReviews: ProductReview[];
  loading: boolean;
  error: string | null;
  filters: ProductReviewFilters;
}

export type ProductReviewsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: ProductReview[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_DATE'; payload: DateFilter }
  | { type: 'SET_RATING'; payload: RatingFilter }
  | { type: 'SET_HELPFUL'; payload: HelpfulFilter }
  | { type: 'RESET_FILTERS' };

export interface UseProductReviewsResult {
  summary: RatingsSummary;
  reviews: ProductReview[];
  loading: boolean;
  error: string | null;
  filters: ProductReviewFilters;
  dispatch: Dispatch<ProductReviewsAction>;
}

export interface EmptyReviewsStateProps {
  filtered?: boolean;
}

export interface PublicReviewCardProps {
  review: ProductReview;
}

export interface ReviewFiltersBarProps {
  filters: ProductReviewFilters;
  onDateChange: (value: DateFilter) => void;
  onRatingChange: (value: RatingFilter) => void;
  onHelpfulChange: (value: HelpfulFilter) => void;
}

export interface ProductRatingsHeaderProps {
  summary: RatingsSummary;
}

export interface ProductReviewsSectionProps {
  productId: string;
}
