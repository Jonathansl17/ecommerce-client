'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useMyReviewsSection } from '../hooks/useMyReviewsSection';
import { REVIEW_STRINGS } from '../constants/reviews.constants';
import { formatReviewDate } from '../shared/formatDate';
import { ReviewForm } from './ReviewForm';
import { ReviewToast } from './ReviewToast';
import { ReviewVotes } from './ReviewVotes';
import { StarRatingDisplay } from './StarRatingDisplay';

export function MyReviewsSection() {
  const {
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
  } = useMyReviewsSection();

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-1">
        {REVIEW_STRINGS.pageTitle}
      </h2>

      {loading && (
        <p className="text-sm text-muted-foreground">{REVIEW_STRINGS.loading}</p>
      )}

      {!loading && error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {!loading && !error && reviewedItems.length === 0 && (
        <p className="text-sm text-muted-foreground">{REVIEW_STRINGS.profileEmpty}</p>
      )}

      {!loading && !error && reviewedItems.length > 0 && (
        <ul className="space-y-3 mt-4">
          {reviewedItems.map(({ product, review }) =>
            review ? (
              <li
                key={review.id}
                className="rounded-md border border-foreground/10 bg-muted/30 p-4 space-y-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{product.name}</p>
                </div>

                {editingReviewId === review.id ? (
                  <ReviewForm
                    initialData={{ rating: review.rating, comment: review.comment }}
                    submitting={submittingReviewId === review.id}
                    onCancel={cancelEditing}
                    onSubmit={(data) => submitEdit(review.id, data)}
                    submitLabel={REVIEW_STRINGS.update}
                    submittingLabel={REVIEW_STRINGS.updating}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        {REVIEW_STRINGS.reviewedOn(formatReviewDate(review.updatedAt))}
                        {review.edited ? ` · ${REVIEW_STRINGS.editedTag}` : ''}
                      </p>
                      <StarRatingDisplay value={review.rating} size="sm" />
                    </div>

                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{review.comment}</p>

                    <div className="flex items-center justify-between gap-3">
                      <ReviewVotes
                        helpfulVotes={review.helpfulVotes}
                        unhelpfulVotes={review.unhelpfulVotes}
                      />
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => startEditing(review.id)}
                          className="text-sm font-medium text-foreground underline hover:opacity-80"
                        >
                          {REVIEW_STRINGS.editReview}
                        </button>
                        <button
                          type="button"
                          onClick={() => startConfirmingDelete(review.id)}
                          className="text-sm font-medium text-destructive underline hover:opacity-80"
                        >
                          {REVIEW_STRINGS.deleteReview}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ) : null,
          )}
        </ul>
      )}

      <ConfirmDialog
        open={confirmingReviewId !== null}
        title={REVIEW_STRINGS.deleteDialogTitle}
        message={REVIEW_STRINGS.deleteDialogMessage}
        confirmLabel={deletingReviewId ? REVIEW_STRINGS.deleting : REVIEW_STRINGS.deleteDialogConfirm}
        cancelLabel={REVIEW_STRINGS.deleteDialogCancel}
        loading={deletingReviewId !== null}
        destructive
        onConfirm={confirmDelete}
        onCancel={cancelConfirmingDelete}
      />

      {toastMessage && <ReviewToast message={toastMessage} onClose={closeToast} />}
    </div>
  );
}
