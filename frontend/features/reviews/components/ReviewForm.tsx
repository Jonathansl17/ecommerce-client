'use client';

import { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { StarRating } from './StarRating';
import { REVIEW_LIMITS, REVIEW_STRINGS } from '../constants/reviews.constants';
import { hasErrors, validateReviewForm } from '../shared/reviews.validation';
import type {
  ReviewFormData,
  ReviewFormErrors,
  ReviewFormProps,
  ReviewRating,
} from '../types/reviews.types';

const EMPTY_FORM: ReviewFormData = { rating: 0, comment: '' };

export function ReviewForm({
  initialData,
  submitting,
  onCancel,
  onSubmit,
  submitLabel,
  submittingLabel,
}: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>(initialData ?? EMPTY_FORM);
  const [errors, setErrors] = useState<ReviewFormErrors>({});

  const handleRatingChange = (rating: ReviewRating) => {
    setFormData((prev) => ({ ...prev, rating }));
    setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, REVIEW_LIMITS.MAX_COMMENT);
    setFormData((prev) => ({ ...prev, comment: value }));
    setErrors((prev) => ({ ...prev, comment: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateReviewForm(formData);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : REVIEW_STRINGS.errors.submitFailed,
      });
    }
  };

  const commentLength = formData.comment.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errors.general && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.general}
        </p>
      )}

      <FormField id="review-rating" label={REVIEW_STRINGS.ratingLabel} error={errors.rating}>
        <StarRating
          value={formData.rating}
          onChange={handleRatingChange}
          disabled={submitting}
          hasError={!!errors.rating}
        />
      </FormField>

      <FormField id="review-comment" label={REVIEW_STRINGS.commentLabel} error={errors.comment}>
        <div className="space-y-1">
          <textarea
            id="review-comment"
            value={formData.comment}
            onChange={handleCommentChange}
            placeholder={REVIEW_STRINGS.commentPlaceholder}
            disabled={submitting}
            minLength={REVIEW_LIMITS.MIN_COMMENT}
            maxLength={REVIEW_LIMITS.MAX_COMMENT}
            rows={4}
            aria-describedby={errors.comment ? 'review-comment-error' : 'review-comment-counter'}
            className={`w-full resize-none rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/30 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.comment ? 'border-destructive' : 'border-foreground/20'
            }`}
          />
          <p
            id="review-comment-counter"
            className={`text-right text-xs ${
              commentLength > REVIEW_LIMITS.MAX_COMMENT
                ? 'text-destructive'
                : 'text-muted-foreground'
            }`}
          >
            {REVIEW_STRINGS.counter(commentLength, REVIEW_LIMITS.MAX_COMMENT)}
          </p>
        </div>
      </FormField>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onCancel}
            disabled={submitting}
            className="sm:w-auto sm:px-5"
          >
            {REVIEW_STRINGS.cancel}
          </Button>
        )}
        <Button
          type="submit"
          fullWidth
          isLoading={submitting}
          loadingText={submittingLabel}
          className="sm:w-auto sm:px-5"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
