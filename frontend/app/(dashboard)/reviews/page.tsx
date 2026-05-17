'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useReviews } from '@/features/reviews/hooks/useReviews';
import { PurchasedProductCard } from '@/features/reviews/components/PurchasedProductCard';
import { ReviewToast } from '@/features/reviews/components/ReviewToast';
import { REVIEW_STRINGS } from '@/features/reviews/constants/reviews.constants';
import { Pagination } from '@/components/ui/Pagination';
import { ROUTES } from '@/lib/constants/routes.constants';
import type { ReviewFormData } from '@/features/reviews/types/reviews.types';

export default function ReviewsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    items,
    pagination,
    loading,
    error,
    setPage,
    submitReview,
    updateReview,
    deleteReview,
  } = useReviews();

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [submittingProductId, setSubmittingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <p className="text-sm text-muted-foreground">{REVIEW_STRINGS.loading}</p>
    );
  }

  const handleSubmit = async (productId: string, data: ReviewFormData) => {
    setSubmittingProductId(productId);
    try {
      const item = items.find((i) => i.product.itemId === productId);
      if (item?.review) {
        await updateReview(item.review.id, data);
        setToastMessage(REVIEW_STRINGS.successUpdated);
      } else {
        await submitReview(productId, data);
        setToastMessage(REVIEW_STRINGS.successPublished);
      }
      setEditingProductId(null);
    } finally {
      setSubmittingProductId(null);
    }
  };

  const handleDelete = async (productId: string) => {
    const item = items.find((i) => i.product.itemId === productId);
    if (!item?.review) return;

    setDeletingProductId(productId);
    try {
      await deleteReview(item.review.id);
      setToastMessage(REVIEW_STRINGS.successDeleted);
      if (editingProductId === productId) {
        setEditingProductId(null);
      }
    } catch (err) {
      setToastMessage(
        err instanceof Error ? err.message : REVIEW_STRINGS.errors.deleteFailed,
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{REVIEW_STRINGS.pageTitle}</h1>
        <p className="text-foreground/70">{REVIEW_STRINGS.pageSubtitle}</p>
      </header>

      {loading && (
        <p className="text-sm text-muted-foreground">{REVIEW_STRINGS.loading}</p>
      )}

      {!loading && error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="rounded-md border border-dashed border-foreground/20 px-4 py-10 text-center text-sm text-muted-foreground">
          {REVIEW_STRINGS.empty}
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <section className="space-y-4">
          {items.map((item) => (
            <PurchasedProductCard
              key={item.product.itemId}
              item={item}
              isEditing={editingProductId === item.product.itemId}
              submitting={submittingProductId === item.product.itemId}
              deleting={deletingProductId === item.product.itemId}
              onStartEditing={() => setEditingProductId(item.product.itemId)}
              onCancel={() => setEditingProductId(null)}
              onSubmit={(data) => handleSubmit(item.product.itemId, data)}
              onDelete={() => handleDelete(item.product.itemId)}
            />
          ))}

          <Pagination
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            itemLabelSingular="producto"
            itemLabelPlural="productos"
            onPageChange={setPage}
            disabled={loading}
          />
        </section>
      )}

      {toastMessage && (
        <ReviewToast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
