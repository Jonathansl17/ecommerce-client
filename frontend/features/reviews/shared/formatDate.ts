import { REVIEW_DATE_FORMAT } from '../constants/reviews.constants';

export function formatReviewDate(fechaIso: string): string {
  return new Date(fechaIso).toLocaleDateString(
    REVIEW_DATE_FORMAT.LOCALE,
    REVIEW_DATE_FORMAT.OPTIONS,
  );
}
