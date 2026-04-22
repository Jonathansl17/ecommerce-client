import { REVIEW_LIMITS, REVIEW_STRINGS } from '../constants/reviews.constants';
import type { ReviewFormData, ReviewFormErrors } from '../types/reviews.types';

export function validateReviewForm(data: ReviewFormData): ReviewFormErrors {
  const errors: ReviewFormErrors = {};

  if (
    data.rating < REVIEW_LIMITS.MIN_RATING ||
    data.rating > REVIEW_LIMITS.MAX_RATING
  ) {
    errors.rating = REVIEW_STRINGS.validation.ratingRequired;
  }

  const trimmed = data.comment.trim();
  if (trimmed.length === 0) {
    errors.comment = REVIEW_STRINGS.validation.commentRequired;
  } else if (trimmed.length < REVIEW_LIMITS.MIN_COMMENT) {
    errors.comment = REVIEW_STRINGS.validation.commentMin;
  } else if (trimmed.length > REVIEW_LIMITS.MAX_COMMENT) {
    errors.comment = REVIEW_STRINGS.validation.commentMax;
  }

  return errors;
}

export function hasErrors(errors: ReviewFormErrors): boolean {
  return Object.values(errors).some((value) => !!value);
}
