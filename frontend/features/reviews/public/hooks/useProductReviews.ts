import { useEffect, useMemo, useReducer } from 'react';
import { fetchProductReviews } from '../shared/product-reviews.api';
import type { ProductReview, RatingsSummary } from '@/features/reviews/types/reviews.types';
import type {
  DateFilter,
  HelpfulFilter,
  ProductReviewFilters,
  ProductReviewsAction,
  ProductReviewsState,
  RatingFilter,
  UseProductReviewsResult,
} from '../types/product-reviews.types';

export type {
  DateFilter,
  HelpfulFilter,
  ProductReviewFilters,
  ProductReviewsAction,
  RatingFilter,
  UseProductReviewsResult,
};

const INITIAL_FILTERS: ProductReviewFilters = {
  date: 'recent',
  rating: 'all',
  helpful: 'none',
};

const INITIAL_STATE: ProductReviewsState = {
  rawReviews: [],
  loading: false,
  error: null,
  filters: INITIAL_FILTERS,
};

function reducer(
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

export function useProductReviews(productId: string): UseProductReviewsResult {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: 'FETCH_START' });
    fetchProductReviews(productId)
      .then((data) => {
        if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', payload: data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Error al cargar las reseñas.';
          dispatch({ type: 'FETCH_ERROR', payload: message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Promedio, total y distribución derivados de rawReviews con useMemo.
  // No se obtienen de un campo pre-calculado: se recomputan cada vez
  // que cambia el array de reseñas cargadas.
  const summary = useMemo<RatingsSummary>(() => {
    const reviews = state.rawReviews;
    const totalReviews = reviews.length;

    const base: RatingsSummary = {
      productId,
      average: 0,
      totalReviews: 0,
      stars1: 0,
      stars2: 0,
      stars3: 0,
      stars4: 0,
      stars5: 0,
    };

    if (totalReviews === 0) return base;

    const totalScore = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = Math.round((totalScore / totalReviews) * 10) / 10;

    const distribution = reviews.reduce(
      (acc, r) => {
        const key = `stars${r.rating}` as keyof Pick<
          RatingsSummary,
          'stars1' | 'stars2' | 'stars3' | 'stars4' | 'stars5'
        >;
        acc[key] += 1;
        return acc;
      },
      { stars1: 0, stars2: 0, stars3: 0, stars4: 0, stars5: 0 },
    );

    return { productId, average, totalReviews, ...distribution };
  }, [state.rawReviews, productId]);

  // Lista filtrada y ordenada, derivada con useMemo.
  // Se recalcula solo cuando cambian las reseñas cargadas o los filtros,
  // no en cada render del consumidor.
  const reviews = useMemo<ProductReview[]>(() => {
    let result = [...state.rawReviews];

    if (state.filters.rating !== 'all') {
      const ratingNum = Number(state.filters.rating);
      result = result.filter((r) => r.rating === ratingNum);
    }

    if (state.filters.helpful === 'most_helpful') {
      result.sort((a, b) => {
        if (b.helpfulVotes !== a.helpfulVotes) return b.helpfulVotes - a.helpfulVotes;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else {
      const dir = state.filters.date === 'recent' ? -1 : 1;
      result.sort(
        (a, b) =>
          dir *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      );
    }

    return result;
  }, [state.rawReviews, state.filters]);

  return {
    summary,
    reviews,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    dispatch,
  };
}
