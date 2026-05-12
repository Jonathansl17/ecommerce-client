'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import {
  fetchMyVotes,
  fetchProductReviews,
  removeReviewVote,
  voteOnReview,
} from '../shared/product-reviews.api';
import { INITIAL_REVIEWS_STATE } from '../constants/product-reviews.constants';
import { productReviewsReducer } from '../reducers/product-reviews.reducer';
import type { RatingsSummary, VoteType } from '../types/reviews.types';
import type { UseProductReviewsResult } from '../types/product-reviews.types';

const EMPTY_SUMMARY: RatingsSummary = {
  productId: '',
  average: 0,
  totalReviews: 0,
  stars1: 0,
  stars2: 0,
  stars3: 0,
  stars4: 0,
  stars5: 0,
};

export function useProductReviews(productId: string): UseProductReviewsResult {
  const { isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(productReviewsReducer, INITIAL_REVIEWS_STATE);
  const { page, limit } = state.pagination;
  const { rating, date, helpful } = state.filters;

  // Fetch de reseñas: dispara con cualquier cambio en filtros, página o producto.
  useEffect(() => {
    let cancelled = false;

    dispatch({ type: 'FETCH_START' });
    fetchProductReviews({ productId, page, limit, rating, date, helpful })
      .then((response) => {
        if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', payload: response });
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
  }, [productId, page, limit, rating, date, helpful]);

  // Fetch de "mis votos" para los IDs de la página actual: solo si autenticado.
  // Se ejecuta tras cambios en la lista renderizada o el estado de auth.
  const reviewIdsKey = state.reviews.map((r) => r.id).join(',');
  useEffect(() => {
    if (!isAuthenticated || state.reviews.length === 0) {
      dispatch({ type: 'SET_MY_VOTES', payload: {} });
      return;
    }
    let cancelled = false;
    fetchMyVotes(state.reviews.map((r) => r.id))
      .then((votes) => {
        if (!cancelled) dispatch({ type: 'SET_MY_VOTES', payload: votes });
      })
      .catch(() => {
        // Silencioso: si falla el fetch de votos, los botones simplemente no se resaltan.
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, reviewIdsKey, state.reviews]);

  // Wrapper genérico para optimistic update + rollback ante fallo.
  const runWithOptimisticUpdate = useCallback(
    async (
      reviewId: string,
      newVote: VoteType | null,
      apiCall: () => Promise<void>,
    ) => {
      const target = state.reviews.find((r) => r.id === reviewId);
      if (!target) return;

      const previousVote = state.myVotes[reviewId] ?? null;
      const snapshot = {
        previousVote,
        helpfulVotes: target.helpfulVotes,
        unhelpfulVotes: target.unhelpfulVotes,
      };

      // Optimistic
      if (newVote === null) {
        dispatch({ type: 'APPLY_VOTE_REMOVAL', payload: { reviewId } });
      } else {
        dispatch({ type: 'APPLY_VOTE', payload: { reviewId, voteType: newVote } });
      }

      try {
        await apiCall();
      } catch (err) {
        // Rollback al snapshot exacto
        dispatch({
          type: 'REVERT_VOTE_STATE',
          payload: { reviewId, ...snapshot },
        });
        throw err;
      }
    },
    [state.reviews, state.myVotes],
  );

  const vote = useCallback(
    async (reviewId: string, voteType: VoteType) => {
      const current = state.myVotes[reviewId] ?? null;
      // Click sobre el voto actual = retiro
      if (current === voteType) {
        await runWithOptimisticUpdate(reviewId, null, () => removeReviewVote(reviewId));
        return;
      }
      await runWithOptimisticUpdate(reviewId, voteType, () =>
        voteOnReview(reviewId, voteType),
      );
    },
    [state.myVotes, runWithOptimisticUpdate],
  );

  const removeVote = useCallback(
    async (reviewId: string) => {
      await runWithOptimisticUpdate(reviewId, null, () => removeReviewVote(reviewId));
    },
    [runWithOptimisticUpdate],
  );

  return {
    reviews: state.reviews,
    summary: state.summary ?? { ...EMPTY_SUMMARY, productId },
    pagination: state.pagination,
    myVotes: state.myVotes,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    dispatch,
    vote,
    removeVote,
  };
}
