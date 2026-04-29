import {
  DATE_OPTIONS,
  HELPFUL_OPTIONS,
  PRODUCT_REVIEW_STRINGS,
  RATING_OPTIONS,
  SELECT_BASE,
} from '../constants/product-reviews.constants';
import type {
  DateFilter,
  HelpfulFilter,
  RatingFilter,
  ReviewFiltersBarProps,
} from '../types/product-reviews.types';

export function ReviewFiltersBar({
  filters,
  onDateChange,
  onRatingChange,
  onHelpfulChange,
}: ReviewFiltersBarProps) {
  // Fecha se deshabilita cuando el ordenamiento por utilidad está activo
  const dateDisabled = filters.helpful === 'most_helpful';

  return (
    <div
      className="flex flex-wrap items-center gap-3"
      role="group"
      aria-label={PRODUCT_REVIEW_STRINGS.filterLabel}
    >
      {/* Calificación */}
      <div className="flex items-center gap-1.5">
        <label
          htmlFor="filter-rating"
          className="text-xs font-medium text-muted-foreground"
        >
          {PRODUCT_REVIEW_STRINGS.filters.rating.label}
        </label>
        <select
          id="filter-rating"
          value={filters.rating}
          onChange={(e) => onRatingChange(e.target.value as RatingFilter)}
          className={SELECT_BASE}
        >
          {RATING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha */}
      <div className="flex items-center gap-1.5">
        <label
          htmlFor="filter-date"
          className={`text-xs font-medium ${dateDisabled ? 'text-muted-foreground/40' : 'text-muted-foreground'}`}
        >
          {PRODUCT_REVIEW_STRINGS.filters.date.label}
        </label>
        <select
          id="filter-date"
          value={filters.date}
          disabled={dateDisabled}
          onChange={(e) => onDateChange(e.target.value as DateFilter)}
          className={SELECT_BASE}
          aria-disabled={dateDisabled}
        >
          {DATE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Utilidad */}
      <div className="flex items-center gap-1.5">
        <label
          htmlFor="filter-helpful"
          className="text-xs font-medium text-muted-foreground"
        >
          {PRODUCT_REVIEW_STRINGS.filters.helpful.label}
        </label>
        <select
          id="filter-helpful"
          value={filters.helpful}
          onChange={(e) => onHelpfulChange(e.target.value as HelpfulFilter)}
          className={SELECT_BASE}
        >
          {HELPFUL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
