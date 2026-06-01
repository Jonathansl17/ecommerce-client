'use client';

import { useId, useState } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StarRatingDisplay } from './StarRatingDisplay';
import {
  PRODUCT_REVIEW_STRINGS,
  REVIEW_DELETE_REASON_OPTIONS,
  SELECT_BASE,
} from '../constants/product-reviews.constants';
import type {
  AdminReviewModerationProps,
  ReviewDeleteReasonCode,
} from '../types/product-reviews.types';

const STRINGS = PRODUCT_REVIEW_STRINGS.moderation;
const DIALOG = STRINGS.dialog;

// Control de moderación (solo admin): botón "Eliminar reseña" que abre un diálogo con
// un resumen de la reseña, un motivo predefinido obligatorio y una descripción
// adicional opcional, antes de eliminar la reseña de otro usuario (US-REV-006).
export function AdminReviewModeration({
  review,
  productName,
  onDeleteReview,
}: AdminReviewModerationProps) {
  const reasonId = useId();
  const detailId = useId();
  const [open, setOpen] = useState(false);
  const [reasonCode, setReasonCode] = useState<ReviewDeleteReasonCode | ''>('');
  const [detail, setDetail] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!onDeleteReview) return null;

  const close = () => {
    if (deleting) return;
    setOpen(false);
    setReasonCode('');
    setDetail('');
    setError(null);
  };

  const handleConfirm = async () => {
    if (reasonCode === '') return;
    setDeleting(true);
    setError(null);
    try {
      const trimmed = detail.trim();
      await onDeleteReview(review.id, {
        reasonCode,
        reasonDetail: trimmed === '' ? undefined : trimmed,
      });
      // Tras eliminar, la reseña se quita del estado y este componente se desmonta.
    } catch (err) {
      setError(err instanceof Error ? err.message : DIALOG.genericError);
      setDeleting(false);
    }
  };

  const remaining = STRINGS.detailMaxLength - detail.length;

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
        title={DIALOG.title}
        message={DIALOG.description}
        confirmLabel={DIALOG.confirm}
        cancelLabel={DIALOG.cancel}
        onConfirm={handleConfirm}
        onCancel={close}
        loading={deleting}
        confirmDisabled={reasonCode === ''}
        showClose
        destructive
      >
        <div className="space-y-4 border-t border-foreground/10 pt-4">
          {error && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {/* Resumen de la reseña a eliminar */}
          <div className="rounded-md border border-foreground/10 bg-muted/40 p-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {DIALOG.previewLabel}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {productName && (
                <span className="text-sm font-semibold text-foreground">
                  {productName}
                </span>
              )}
              <StarRatingDisplay value={review.rating} size="sm" />
              <span className="text-xs text-muted-foreground">
                · {review.clientUserName}
              </span>
            </div>
            <p className="line-clamp-3 whitespace-pre-wrap text-sm text-foreground/80">
              {review.comment}
            </p>
          </div>

          {/* Motivo predefinido (obligatorio) */}
          <div className="space-y-1.5">
            <label
              htmlFor={reasonId}
              className="block text-sm font-medium text-foreground"
            >
              {DIALOG.reasonLabel}
            </label>
            <select
              id={reasonId}
              value={reasonCode}
              onChange={(e) =>
                setReasonCode(e.target.value as ReviewDeleteReasonCode | '')
              }
              disabled={deleting}
              className={`${SELECT_BASE} w-full`}
            >
              <option value="" disabled>
                {DIALOG.reasonPlaceholder}
              </option>
              {REVIEW_DELETE_REASON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción adicional (opcional) */}
          <div className="space-y-1.5">
            <label
              htmlFor={detailId}
              className="block text-sm font-medium text-foreground"
            >
              {DIALOG.detailLabel}
            </label>
            <textarea
              id={detailId}
              value={detail}
              onChange={(e) => setDetail(e.target.value.slice(0, STRINGS.detailMaxLength))}
              placeholder={DIALOG.detailPlaceholder}
              disabled={deleting}
              maxLength={STRINGS.detailMaxLength}
              rows={3}
              className="w-full resize-none rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <p className="text-right text-xs text-muted-foreground">
              {STRINGS.remainingCounter(remaining)}
            </p>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}
