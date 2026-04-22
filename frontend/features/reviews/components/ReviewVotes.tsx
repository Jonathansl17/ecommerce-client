import { REVIEW_STRINGS } from '../constants/reviews.constants';

interface ReviewVotesProps {
  helpfulVotes: number;
  unhelpfulVotes: number;
}

export function ReviewVotes({ helpfulVotes, unhelpfulVotes }: ReviewVotesProps) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span
        className="inline-flex items-center gap-1"
        aria-label={REVIEW_STRINGS.helpfulAriaLabel(helpfulVotes)}
      >
        <span aria-hidden="true">👍</span>
        <span className="font-medium text-foreground/80">{helpfulVotes}</span>
        <span>{REVIEW_STRINGS.helpfulLabel}</span>
      </span>
      <span
        className="inline-flex items-center gap-1"
        aria-label={REVIEW_STRINGS.unhelpfulAriaLabel(unhelpfulVotes)}
      >
        <span aria-hidden="true">👎</span>
        <span className="font-medium text-foreground/80">{unhelpfulVotes}</span>
        <span>{REVIEW_STRINGS.unhelpfulLabel}</span>
      </span>
    </div>
  );
}
