'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import {
  fetchPurchasedProductsWithReviews,
  submitReview as apiSubmitReview,
  updateReview as apiUpdateReview,
} from '../shared/reviews.api';
import { REVIEWS_MOCK } from '../shared/reviews.mock';
import { REVIEW_STRINGS } from '../constants/reviews.constants';
import type {
  ProductReview,
  PurchasedProductWithReview,
  ReviewFormData,
  UseReviewsResult,
} from '../types/reviews.types';

export function useReviews(): UseReviewsResult {
  const { user: authUser } = useAuth();
  const user = authUser ?? (REVIEWS_MOCK.enabled ? REVIEWS_MOCK.user : null);
  const [items, setItems] = useState<PurchasedProductWithReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const data = await fetchPurchasedProductsWithReviews(user.id);
      setItems(data);
    } catch {
      setError(REVIEW_STRINGS.loadError);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const submitReview = useCallback(
    async (productId: string, data: ReviewFormData): Promise<ProductReview> => {
      if (!user) throw new Error(REVIEW_STRINGS.errors.submitFailed);
      const review = await apiSubmitReview(user.id, user.fullName, productId, data);
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, review } : item,
        ),
      );
      return review;
    },
    [user],
  );

  const updateReview = useCallback(
    async (reviewId: string, data: ReviewFormData): Promise<ProductReview> => {
      if (!user) throw new Error(REVIEW_STRINGS.errors.updateFailed);
      const review = await apiUpdateReview(user.id, reviewId, data);
      setItems((prev) =>
        prev.map((item) =>
          item.review?.id === reviewId ? { ...item, review } : item,
        ),
      );
      return review;
    },
    [user],
  );

  return { items, loading, error, submitReview, updateReview };
}
