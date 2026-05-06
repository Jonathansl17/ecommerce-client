import type { Dispatch } from 'react';
import type {
  PaginationMeta,
  ProductReview,
  RatingsSummary,
  VoteType,
} from '@/features/reviews/types/reviews.types';

export type MyReviewVotes = Record<string, VoteType>;

export type DateFilter = 'recent' | 'oldest';
export type RatingFilter = 'all' | '5' | '4' | '3' | '2' | '1';
export type HelpfulFilter = 'none' | 'most_helpful';

export interface ProductReviewFilters {
  date: DateFilter;
  rating: RatingFilter;
  helpful: HelpfulFilter;
}

export interface ProductReviewsServerResponse {
  data: ProductReview[];
  pagination: PaginationMeta;
  summary: RatingsSummary;
}

export interface ProductReviewsState {
  reviews: ProductReview[];
  summary: RatingsSummary | null;
  pagination: PaginationMeta;
  myVotes: MyReviewVotes;
  loading: boolean;
  error: string | null;
  filters: ProductReviewFilters;
}

export type ProductReviewsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: ProductReviewsServerResponse }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_DATE'; payload: DateFilter }
  | { type: 'SET_RATING'; payload: RatingFilter }
  | { type: 'SET_HELPFUL'; payload: HelpfulFilter }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_MY_VOTES'; payload: MyReviewVotes }
  | { type: 'APPLY_VOTE'; payload: { reviewId: string; voteType: VoteType } }
  | { type: 'APPLY_VOTE_REMOVAL'; payload: { reviewId: string } }
  | {
      type: 'REVERT_VOTE_STATE';
      payload: {
        reviewId: string;
        previousVote: VoteType | null;
        helpfulVotes: number;
        unhelpfulVotes: number;
      };
    };

export interface UseProductReviewsResult {
  summary: RatingsSummary;
  reviews: ProductReview[];
  pagination: PaginationMeta;
  myVotes: MyReviewVotes;
  loading: boolean;
  error: string | null;
  filters: ProductReviewFilters;
  dispatch: Dispatch<ProductReviewsAction>;
  vote: (reviewId: string, voteType: VoteType) => Promise<void>;
  removeVote: (reviewId: string) => Promise<void>;
}

export interface EmptyReviewsStateProps {
  filtered?: boolean;
}

export interface PublicReviewCardProps {
  review: ProductReview;
  currentUserVote?: VoteType | null;
  isOwnReview?: boolean;
  isAuthenticated?: boolean;
  onVote?: (reviewId: string, voteType: VoteType) => Promise<void>;
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
