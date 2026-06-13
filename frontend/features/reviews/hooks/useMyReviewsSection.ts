'use client';

import { useState } from 'react';
import { useReviews } from './useReviews';
import { REVIEW_STRINGS } from '../constants/reviews.constants';
import type { ReviewFormData } from '../types/reviews.types';

export function useMyReviewsSection() {
  const { items, loading, error, updateReview, deleteReview } = useReviews();
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [submittingReviewId, setSubmittingReviewId] = useState<string | null>(null);
  const [confirmingReviewId, setConfirmingReviewId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reviewedItems = items.filter((item) => item.review !== null);

  const startEditing = (reviewId: string) => setEditingReviewId(reviewId);
  const cancelEditing = () => setEditingReviewId(null);
  const startConfirmingDelete = (reviewId: string) => setConfirmingReviewId(reviewId);
  const cancelConfirmingDelete = () => setConfirmingReviewId(null);
  const closeToast = () => setToastMessage(null);

  const submitEdit = async (reviewId: string, data: ReviewFormData) => {
    setSubmittingReviewId(reviewId);
    try {
      await updateReview(reviewId, data);
      setToastMessage(REVIEW_STRINGS.successUpdated);
      setEditingReviewId(null);
    } catch (err) {
      setToastMessage(
        err instanceof Error ? err.message : REVIEW_STRINGS.errors.updateFailed,
      );
    } finally {
      setSubmittingReviewId(null);
    }
  };

  const confirmDelete = async () => {
    if (!confirmingReviewId) return;

    setDeletingReviewId(confirmingReviewId);
    try {
      await deleteReview(confirmingReviewId);
      setToastMessage(REVIEW_STRINGS.successDeleted);
      setConfirmingReviewId(null);
    } catch (err) {
      setToastMessage(
        err instanceof Error ? err.message : REVIEW_STRINGS.errors.deleteFailed,
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  return {
    reviewedItems,
    loading,
    error,
    editingReviewId,
    submittingReviewId,
    confirmingReviewId,
    deletingReviewId,
    toastMessage,
    startEditing,
    cancelEditing,
    startConfirmingDelete,
    cancelConfirmingDelete,
    closeToast,
    submitEdit,
    confirmDelete,
  };
}
