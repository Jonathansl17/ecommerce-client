'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { REVIEW_LIMITS, REVIEW_STRINGS } from '../constants/reviews.constants';
import type { ReviewRating, StarRatingProps } from '../types/reviews.types';

const STAR_VALUES: ReviewRating[] = [1, 2, 3, 4, 5];

export function StarRating({
  value,
  onChange,
  disabled = false,
  hasError = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<ReviewRating | 0>(0);
  const displayValue = hovered || value;

  return (
    <div
      role="radiogroup"
      aria-label={REVIEW_STRINGS.ratingLabel}
      className="flex items-center gap-1"
    >
      {STAR_VALUES.map((starValue) => {
        const isActive = starValue <= displayValue;
        const ringClass = hasError ? 'focus-visible:ring-destructive' : 'focus-visible:ring-ring';
        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={REVIEW_STRINGS.ratingAriaLabel(starValue)}
            disabled={disabled}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            onFocus={() => setHovered(starValue)}
            onBlur={() => setHovered(0)}
            className={`rounded-md p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${ringClass}`}
          >
            <Star
              className={`h-7 w-7 ${
                isActive ? 'fill-yellow-400 text-yellow-400' : 'text-foreground/30'
              }`}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground">
        {value > 0 ? `${value}/${REVIEW_LIMITS.MAX_RATING}` : ''}
      </span>
    </div>
  );
}
