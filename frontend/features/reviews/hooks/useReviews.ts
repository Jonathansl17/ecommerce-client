'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import {
  fetchPurchasedProductsWithReviews,
  submitReview as apiSubmitReview,
  updateReview as apiUpdateReview,
  deleteReview as apiDeleteReview,
} from '../shared/reviews.api';
import {
  PURCHASED_PRODUCTS_PAGE_SIZE,
  REVIEW_STRINGS,
  LENGHT
} from '../constants/reviews.constants';
import type {
  PaginationMeta,
  ProductReview,
  PurchasedProductWithReview,
  ReviewFormData,
  UseReviewsResult,
} from '../types/reviews.types';

const INITIAL_PAGINATION: PaginationMeta = {
  page: LENGHT.ONE,
  limit: PURCHASED_PRODUCTS_PAGE_SIZE,
  total: LENGHT.ZERO,
};

export function useReviews(): UseReviewsResult {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<PurchasedProductWithReview[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(INITIAL_PAGINATION);
  const [page, setPage] = useState(LENGHT.ONE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setPagination(INITIAL_PAGINATION);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const response = await fetchPurchasedProductsWithReviews(
        page,
        PURCHASED_PRODUCTS_PAGE_SIZE,
      );
      setItems(response.data);
      setPagination(response.pagination);
    } catch {
      setError(REVIEW_STRINGS.loadError);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, page]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const submitReview = useCallback(
    async (productId: string, data: ReviewFormData): Promise<ProductReview> => {
      const review = await apiSubmitReview(productId, data);
      setItems((prev) =>
        prev.map((item) =>
          item.product.itemId === productId ? { ...item, review } : item,
        ),
      );
      return review;
    },
    [],
  );

  const updateReview = useCallback(
    async (reviewId: string, data: ReviewFormData): Promise<ProductReview> => {
      const review = await apiUpdateReview(reviewId, data);
      setItems((prev) =>
        prev.map((item) =>
          item.review?.id === reviewId ? { ...item, review } : item,
        ),
      );
      return review;
    },
    [],
  );

  const deleteReview = useCallback(async (reviewId: string): Promise<void> => {
    await apiDeleteReview(reviewId);
    setItems((prev) =>
      prev.map((item) =>
        item.review?.id === reviewId ? { ...item, review: null } : item,
      ),
    );
  }, []);

  return {
    items,
    pagination,
    loading,
    error,
    setPage,
    submitReview,
    updateReview,
    deleteReview,
  };
}
