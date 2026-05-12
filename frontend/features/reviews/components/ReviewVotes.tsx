import { useRef, useState } from 'react';
import { REVIEW_STRINGS } from '../constants/reviews.constants';
import type { VoteType } from '../types/reviews.types';

interface ReviewVotesProps {
  helpfulVotes: number;
  unhelpfulVotes: number;
  // Modo interactivo — todas opcionales para no romper usos solo-lectura existentes.
  currentUserVote?: VoteType | null;
  /** True cuando el visitante es el autor de la reseña: oculta los botones. */
  isOwnReview?: boolean;
  /** True cuando no hay sesión: muestra los contadores pero deshabilita el voto. */
  isAuthenticated?: boolean;
  onVote?: (voteType: VoteType) => Promise<void> | void;
}

export function ReviewVotes({
  helpfulVotes,
  unhelpfulVotes,
  currentUserVote = null,
  isOwnReview = false,
  isAuthenticated = false,
  onVote,
}: ReviewVotesProps) {
  const [submitting, setSubmitting] = useState(false);
  // Guard síncrono: setSubmitting no se refleja antes del próximo render, así que
  // clicks rapidísimos en el mismo tick burlaban el flag de useState y disparaban
  // múltiples POST → la UI rollbackeaba al chocar con la unique constraint en DB.
  const inFlightRef = useRef(false);

  // Modo solo-lectura: si no hay onVote, o el visitante es el autor → contadores estáticos.
  const interactive = Boolean(onVote) && !isOwnReview;

  const handleClick = async (voteType: VoteType) => {
    if (!onVote || inFlightRef.current || !isAuthenticated) return;
    inFlightRef.current = true;
    setSubmitting(true);
    try {
      await onVote(voteType);
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  };

  if (!interactive) {
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

  const helpfulSelected = currentUserVote === 'helpful';
  const unhelpfulSelected = currentUserVote === 'unhelpful';
  const baseBtn =
    'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60';
  const inactive = 'border-foreground/15 text-muted-foreground hover:bg-foreground/5';
  const active =
    'border-primary/40 bg-primary/10 text-primary';

  const tooltip = !isAuthenticated ? 'Inicia sesión para votar' : undefined;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleClick('helpful')}
        disabled={submitting || !isAuthenticated}
        aria-pressed={helpfulSelected}
        aria-label={REVIEW_STRINGS.helpfulAriaLabel(helpfulVotes)}
        title={tooltip}
        className={`${baseBtn} ${helpfulSelected ? active : inactive}`}
      >
        <span aria-hidden="true">👍</span>
        <span>{REVIEW_STRINGS.helpfulLabel}</span>
        <span className="tabular-nums">{helpfulVotes}</span>
      </button>
      <button
        type="button"
        onClick={() => handleClick('unhelpful')}
        disabled={submitting || !isAuthenticated}
        aria-pressed={unhelpfulSelected}
        aria-label={REVIEW_STRINGS.unhelpfulAriaLabel(unhelpfulVotes)}
        title={tooltip}
        className={`${baseBtn} ${unhelpfulSelected ? active : inactive}`}
      >
        <span aria-hidden="true">👎</span>
        <span>{REVIEW_STRINGS.unhelpfulLabel}</span>
        <span className="tabular-nums">{unhelpfulVotes}</span>
      </button>
    </div>
  );
}
