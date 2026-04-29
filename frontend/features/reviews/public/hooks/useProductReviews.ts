import { useEffect, useMemo, useReducer } from 'react';
import { fetchProductReviews } from '../shared/product-reviews.api';
import { INITIAL_REVIEWS_STATE } from '../constants/product-reviews.constants';
import { productReviewsReducer } from '../reducers/product-reviews.reducer';
import { computeRatingsSummary } from '../utils/compute-ratings-summary';
import { filterAndSortReviews } from '../utils/filter-sort-reviews';
import type { UseProductReviewsResult } from '../types/product-reviews.types';

export function useProductReviews(productId: string): UseProductReviewsResult {
  const [state, dispatch] = useReducer(productReviewsReducer, INITIAL_REVIEWS_STATE);

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

  const summary = useMemo(
    () => computeRatingsSummary(productId, state.rawReviews),
    [productId, state.rawReviews],
  );

  const reviews = useMemo(
    () => filterAndSortReviews(state.rawReviews, state.filters),
    [state.rawReviews, state.filters],
  );

  return {
    summary,
    reviews,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    dispatch,
  };
}
