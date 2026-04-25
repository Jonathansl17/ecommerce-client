'use client';

import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { REVIEW_STRINGS, TOAST_AUTO_DISMISS_MS } from '../constants/reviews.constants';
import type { ReviewToastProps } from '../types/reviews.types';

export function ReviewToast({ message, onClose }: ReviewToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg"
    >
      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" aria-hidden="true" />
      <p className="flex-1 text-sm text-foreground">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label={REVIEW_STRINGS.closeToast}
        className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
