import { INITIAL_FILTERS } from '../constants/product-reviews.constants';
import type {
  ProductReviewsAction,
  ProductReviewsState,
} from '../types/product-reviews.types';

export function productReviewsReducer(
  state: ProductReviewsState,
  action: ProductReviewsAction,
): ProductReviewsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, rawReviews: action.payload };

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'SET_DATE':
      // Activar fecha desactiva ordenamiento por utilidad
      return {
        ...state,
        filters: { ...state.filters, date: action.payload, helpful: 'none' },
      };

    case 'SET_RATING':
      return {
        ...state,
        filters: { ...state.filters, rating: action.payload },
      };

    case 'SET_HELPFUL':
      return {
        ...state,
        filters: { ...state.filters, helpful: action.payload },
      };

    case 'RESET_FILTERS':
      return { ...state, filters: INITIAL_FILTERS };

    default:
      return state;
  }
}
