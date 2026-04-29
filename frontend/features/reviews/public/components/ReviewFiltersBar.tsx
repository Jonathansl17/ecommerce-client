import { PRODUCT_REVIEW_STRINGS } from '../constants/product-reviews.constants';
import type {
  DateFilter,
  HelpfulFilter,
  RatingFilter,
  ReviewFiltersBarProps,
} from '../types/product-reviews.types';

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: 'recent', label: PRODUCT_REVIEW_STRINGS.filters.date.recent },
  { value: 'oldest', label: PRODUCT_REVIEW_STRINGS.filters.date.oldest },
];

const RATING_OPTIONS: { value: RatingFilter; label: string }[] = [
  { value: 'all', label: PRODUCT_REVIEW_STRINGS.filters.rating.all },
  { value: '5', label: PRODUCT_REVIEW_STRINGS.filters.rating['5'] },
  { value: '4', label: PRODUCT_REVIEW_STRINGS.filters.rating['4'] },
  { value: '3', label: PRODUCT_REVIEW_STRINGS.filters.rating['3'] },
  { value: '2', label: PRODUCT_REVIEW_STRINGS.filters.rating['2'] },
  { value: '1', label: PRODUCT_REVIEW_STRINGS.filters.rating['1'] },
];

const HELPFUL_OPTIONS: { value: HelpfulFilter; label: string }[] = [
  { value: 'none', label: PRODUCT_REVIEW_STRINGS.filters.helpful.none },
  { value: 'most_helpful', label: PRODUCT_REVIEW_STRINGS.filters.helpful.most_helpful },
];

const SELECT_BASE =
  'rounded-md border border-foreground/15 bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50';

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
