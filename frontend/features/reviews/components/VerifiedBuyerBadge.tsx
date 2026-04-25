import { ShieldCheck } from 'lucide-react';
import { REVIEW_STRINGS } from '../constants/reviews.constants';

export function VerifiedBuyerBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
      {REVIEW_STRINGS.verifiedBadge}
    </span>
  );
}
