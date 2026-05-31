'use client';

import { useId, useState } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PRODUCT_REVIEW_STRINGS } from '../constants/product-reviews.constants';
import type { ProductReview } from '../types/reviews.types';

const STRINGS = PRODUCT_REVIEW_STRINGS.moderation;

interface AdminReviewModerationProps {
  review: ProductReview;
  onDeleteReview?: (reviewId: string, reason: string) => Promise<void>;
}

// Control de moderación (solo admin): botón "Eliminar reseña" que abre un diálogo
// donde se exige el motivo antes de eliminar la reseña de otro usuario (US-REV-006).
export function AdminReviewModeration({
  review,
  onDeleteReview,
}: AdminReviewModerationProps) {
  const reasonId = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!onDeleteReview) return null;

  const close = () => {
    if (deleting) return;
    setOpen(false);
    setReason('');
    setError(null);
  };

  const handleConfirm = async () => {
    const trimmed = reason.trim();
    if (trimmed === '') return;
    setDeleting(true);
    setError(null);
    try {
      await onDeleteReview(review.id, trimmed);
      // Tras eliminar, la reseña se quita del estado y este componente se desmonta.
    } catch (err) {
      setError(err instanceof Error ? err.message : STRINGS.dialog.genericError);
      setDeleting(false);
    }
  };

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-destructive hover:underline"
      >
        {STRINGS.deleteAction}
      </button>

      <ConfirmDialog
        open={open}
        title={STRINGS.dialog.title}
        message={STRINGS.dialog.message(review.clientUserName)}
        confirmLabel={STRINGS.dialog.confirm}
        cancelLabel={STRINGS.dialog.cancel}
        onConfirm={handleConfirm}
        onCancel={close}
        loading={deleting}
        confirmDisabled={reason.trim() === ''}
        destructive
      >
        <div className="space-y-2">
          {error && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <label
            htmlFor={reasonId}
            className="block text-sm font-medium text-foreground"
          >
            {STRINGS.dialog.reasonLabel}
          </label>
          <textarea
            id={reasonId}
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, STRINGS.maxLength))}
            placeholder={STRINGS.dialog.reasonPlaceholder}
            disabled={deleting}
            maxLength={STRINGS.maxLength}
            rows={3}
            className="w-full resize-none rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p className="text-right text-xs text-muted-foreground">
            {STRINGS.counter(reason.length, STRINGS.maxLength)}
          </p>
        </div>
      </ConfirmDialog>
    </div>
  );
}
