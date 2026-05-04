'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  rating: number | null;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  label?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  editable = false,
  onChange,
  showValue = true,
  label,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayRating = hovered ?? rating ?? 0;

  const sizes = {
    sm: '16px',
    md: '20px',
    lg: '24px',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      {label && <span className="text-xs text-on-surface-variant mr-1">{label}</span>}
      <div className="inline-flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayRating;

          return (
            <button
              key={i}
              type="button"
              disabled={!editable}
              onClick={() => editable && onChange?.(starValue)}
              onMouseEnter={() => editable && setHovered(starValue)}
              onMouseLeave={() => editable && setHovered(null)}
              className={cn(
                'transition-colors disabled:cursor-default',
                editable && 'cursor-pointer hover:scale-110 transition-transform',
                isFilled ? 'text-amber-accent' : 'text-outline-variant'
              )}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <span
                className={cn('material-symbols-outlined', isFilled && 'filled')}
                style={{ fontSize: sizes[size] }}
              >
                star
              </span>
            </button>
          );
        })}
      </div>
      {showValue && rating !== null && rating !== undefined && (
        <span className="text-sm font-medium text-on-surface ml-0.5">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
