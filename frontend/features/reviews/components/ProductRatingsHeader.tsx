import { Star } from 'lucide-react';
import { PRODUCT_REVIEW_STRINGS } from '../constants/product-reviews.constants';
import type { ProductRatingsHeaderProps } from '../types/product-reviews.types';

const STAR_LEVELS = [5, 4, 3, 2, 1] as const;

function RatingBar({
  level,
  count,
  total,
}: {
  level: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const ariaLabel = PRODUCT_REVIEW_STRINGS.starsBarAriaLabel(level, count, pct);

  return (
    <div className="flex items-center gap-2" aria-label={ariaLabel}>
      <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
        {PRODUCT_REVIEW_STRINGS.starsLabel(level)}
      </span>
      <div
        className="relative h-2 flex-1 overflow-hidden rounded-full bg-foreground/10"
        role="presentation"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-yellow-400 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-xs text-muted-foreground">{count}</span>
    </div>
  );
}

export function ProductRatingsHeader({ summary }: ProductRatingsHeaderProps) {
  const { average, totalReviews, stars1, stars2, stars3, stars4, stars5 } = summary;
  const countsMap: Record<number, number> = { 5: stars5, 4: stars4, 3: stars3, 2: stars2, 1: stars1 };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-foreground/10 bg-muted/20 p-5 sm:flex-row sm:items-center sm:gap-8">
      {/* Promedio */}
      <div className="flex shrink-0 flex-col items-center gap-1 sm:w-28">
        <div className="flex items-center gap-1.5">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" aria-hidden="true" />
          <span className="text-4xl font-bold text-foreground">
            {totalReviews > 0 ? average.toFixed(1) : '—'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {PRODUCT_REVIEW_STRINGS.reviewsCountLabel(totalReviews)}
        </p>
      </div>

      {/* Barras de distribución */}
      <div className="flex-1 space-y-1.5" aria-label={PRODUCT_REVIEW_STRINGS.averageLabel}>
        {STAR_LEVELS.map((level) => (
          <RatingBar
            key={level}
            level={level}
            count={countsMap[level]}
            total={totalReviews}
          />
        ))}
      </div>
    </div>
  );
}
