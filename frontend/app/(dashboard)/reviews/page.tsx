'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useReviews } from '@/features/reviews/hooks/useReviews';
import { PurchasedProductCard } from '@/features/reviews/components/PurchasedProductCard';
import { ReviewToast } from '@/features/reviews/components/ReviewToast';
import { REVIEW_STRINGS } from '@/features/reviews/constants/reviews.constants';
import { REVIEWS_MOCK } from '@/features/reviews/shared/reviews.mock';
import { ROUTES } from '@/lib/constants/routes.constants';
import type { ReviewFormData } from '@/features/reviews/types/reviews.types';

export default function ReviewsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, loading, error, submitReview, updateReview } = useReviews();

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [submittingProductId, setSubmittingProductId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (REVIEWS_MOCK.enabled) return;
    if (!authLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [authLoading, isAuthenticated, router]);

  if (!REVIEWS_MOCK.enabled && (authLoading || !isAuthenticated)) {
    return (
      <p className="text-sm text-muted-foreground">{REVIEW_STRINGS.loading}</p>
    );
  }

  const handleSubmit = async (productId: string, data: ReviewFormData) => {
    setSubmittingProductId(productId);
    try {
      const item = items.find((i) => i.product.id === productId);
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
              key={item.product.id}
              item={item}
              isEditing={editingProductId === item.product.id}
              submitting={submittingProductId === item.product.id}
              onStartEditing={() => setEditingProductId(item.product.id)}
              onCancel={() => setEditingProductId(null)}
              onSubmit={(data) => handleSubmit(item.product.id, data)}
            />
          ))}
        </section>
      )}

      {toastMessage && (
        <ReviewToast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
