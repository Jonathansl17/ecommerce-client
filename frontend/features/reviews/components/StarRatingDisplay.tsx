import { Star } from 'lucide-react';
import { REVIEW_LIMITS, REVIEW_STRINGS } from '../constants/reviews.constants';
import type { StarRatingDisplayProps } from '../types/reviews.types';

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
} as const;

export function StarRatingDisplay({ value, size = 'md' }: StarRatingDisplayProps) {
  const sizeClass = SIZES[size];
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={REVIEW_STRINGS.ratingAriaLabel(value)}
    >
      {Array.from({ length: REVIEW_LIMITS.MAX_RATING }, (_, index) => {
        const isActive = index < value;
        return (
          <Star
            key={index}
            className={`${sizeClass} ${
              isActive ? 'fill-yellow-400 text-yellow-400' : 'text-foreground/20'
            }`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
