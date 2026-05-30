import { INITIAL_FILTERS } from '../constants/product-reviews.constants';
import type { ProductReview, VoteType } from '../types/reviews.types';
import type {
  MyReviewVotes,
  ProductReviewsAction,
  ProductReviewsState,
} from '../types/product-reviews.types';

// Aplica el delta de un voto sobre la lista de reseñas (helpfulVotes/unhelpfulVotes).
function adjustReviewCounters(
  reviews: ProductReview[],
  reviewId: string,
  previousVote: VoteType | null,
  newVote: VoteType | null,
): ProductReview[] {
  if (previousVote === newVote) return reviews;

  return reviews.map((r) => {
    if (r.id !== reviewId) return r;
    let { helpfulVotes, unhelpfulVotes } = r;
    if (previousVote === 'helpful') helpfulVotes -= 1;
    if (previousVote === 'unhelpful') unhelpfulVotes -= 1;
    if (newVote === 'helpful') helpfulVotes += 1;
    if (newVote === 'unhelpful') unhelpfulVotes += 1;
    return { ...r, helpfulVotes, unhelpfulVotes };
  });
}

function setVoteForReview(
  votes: MyReviewVotes,
  reviewId: string,
  voteType: VoteType | null,
): MyReviewVotes {
  const next = { ...votes };
  if (voteType === null) delete next[reviewId];
  else next[reviewId] = voteType;
  return next;
}

// Cambios de filtro o de calificación deben volver a la página 1; cambiar de página
// preserva los filtros vigentes. La paginación, los datos y el summary vienen del
// backend en cada respuesta — el reducer no recalcula nada en cliente.
export function productReviewsReducer(
  state: ProductReviewsState,
  action: ProductReviewsAction,
): ProductReviewsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        reviews: action.payload.data,
        pagination: action.payload.pagination,
        summary: action.payload.summary,
      };

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'SET_DATE':
      return {
        ...state,
        filters: { ...state.filters, date: action.payload, helpful: 'none' },
        pagination: { ...state.pagination, page: 1 },
      };

    case 'SET_RATING':
      return {
        ...state,
        filters: { ...state.filters, rating: action.payload },
        pagination: { ...state.pagination, page: 1 },
      };

    case 'SET_HELPFUL':
      return {
        ...state,
        filters: { ...state.filters, helpful: action.payload },
        pagination: { ...state.pagination, page: 1 },
      };

    case 'SET_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload },
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: INITIAL_FILTERS,
        pagination: { ...state.pagination, page: 1 },
      };

    case 'SET_MY_VOTES':
      return { ...state, myVotes: action.payload };

    case 'APPLY_VOTE': {
      const { reviewId, voteType } = action.payload;
      const previous = state.myVotes[reviewId] ?? null;
      return {
        ...state,
        myVotes: setVoteForReview(state.myVotes, reviewId, voteType),
        reviews: adjustReviewCounters(state.reviews, reviewId, previous, voteType),
      };
    }

    case 'APPLY_VOTE_REMOVAL': {
      const { reviewId } = action.payload;
      const previous = state.myVotes[reviewId] ?? null;
      if (previous === null) return state;
      return {
        ...state,
        myVotes: setVoteForReview(state.myVotes, reviewId, null),
        reviews: adjustReviewCounters(state.reviews, reviewId, previous, null),
      };
    }

    case 'SET_RESPONSE': {
      const { reviewId, response } = action.payload;
      return {
        ...state,
        reviews: state.reviews.map((r) =>
          r.id === reviewId ? { ...r, response } : r,
        ),
      };
    }

    case 'REVERT_VOTE_STATE': {
      const { reviewId, previousVote, helpfulVotes, unhelpfulVotes } = action.payload;
      return {
        ...state,
        myVotes: setVoteForReview(state.myVotes, reviewId, previousVote),
        reviews: state.reviews.map((r) =>
          r.id === reviewId ? { ...r, helpfulVotes, unhelpfulVotes } : r,
        ),
      };
    }

    default:
      return state;
  }
}
