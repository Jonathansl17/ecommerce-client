'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  PRODUCT_REVIEW_STRINGS,
  PRODUCT_REVIEW_DATE_FORMAT,
} from '../constants/product-reviews.constants';
import type { ProductReview, ReviewResponse } from '../types/reviews.types';

const STRINGS = PRODUCT_REVIEW_STRINGS.response;

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(
    PRODUCT_REVIEW_DATE_FORMAT.LOCALE,
    PRODUCT_REVIEW_DATE_FORMAT.OPTIONS,
  );
}

interface AdminResponseSectionProps {
  review: ProductReview;
  isAdmin?: boolean;
  onRespond?: (reviewId: string, content: string) => Promise<void>;
  onUpdateResponse?: (reviewId: string, content: string) => Promise<void>;
  onDeleteResponse?: (reviewId: string) => Promise<void>;
}

// Bloque visible para todos con la respuesta oficial. Sin controles de admin.
function ResponseDisplay({ response }: { response: ReviewResponse }) {
  const dateLabel = STRINGS.respondedOn(
    formatDate(response.edited ? response.updatedAt : response.createdAt),
  );

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {STRINGS.badge}
      </p>
      <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
        {response.content}
      </p>
      <p className="text-xs text-muted-foreground">
        {dateLabel}
        {response.edited ? ` · ${STRINGS.editedTag}` : ''}
      </p>
    </div>
  );
}

// Formulario reutilizado para crear y editar la respuesta.
function ResponseForm({
  initialContent,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
}: {
  initialContent: string;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = content.trim();
  const length = content.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmed.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la respuesta.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, STRINGS.maxLength))}
        placeholder={STRINGS.placeholder}
        disabled={submitting}
        maxLength={STRINGS.maxLength}
        rows={3}
        aria-label={STRINGS.badge}
        className="w-full resize-none rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <p className="text-right text-xs text-muted-foreground">
        {STRINGS.counter(length, STRINGS.maxLength)}
      </p>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="!bg-transparent !text-foreground border border-foreground/20 hover:!bg-accent sm:w-auto sm:px-5"
        >
          {STRINGS.actions.cancel}
        </Button>
        <Button
          type="submit"
          isLoading={submitting}
          loadingText={submittingLabel}
          disabled={trimmed.length === 0}
          className="sm:w-auto sm:px-5"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function AdminResponseSection({
  review,
  isAdmin = false,
  onRespond,
  onUpdateResponse,
  onDeleteResponse,
}: AdminResponseSectionProps) {
  const [mode, setMode] = useState<'view' | 'create' | 'edit'>('view');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { response } = review;

  // Sin respuesta y sin permisos de admin → no se renderiza nada.
  if (!response && !isAdmin) return null;

  const containerClass =
    'ml-4 rounded-md border-l-2 border-primary/40 bg-primary/5 p-3 space-y-2';

  const handleDelete = async () => {
    if (!onDeleteResponse) return;
    setDeleting(true);
    try {
      await onDeleteResponse(review.id);
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  // Modo creación (admin, sin respuesta).
  if (mode === 'create' && onRespond) {
    return (
      <div className={containerClass}>
        <ResponseForm
          initialContent=""
          submitLabel={STRINGS.actions.publish}
          submittingLabel={STRINGS.actions.publishing}
          onSubmit={async (content) => {
            await onRespond(review.id, content);
            setMode('view');
          }}
          onCancel={() => setMode('view')}
        />
      </div>
    );
  }

  // Modo edición (admin, con respuesta).
  if (mode === 'edit' && response && onUpdateResponse) {
    return (
      <div className={containerClass}>
        <ResponseForm
          initialContent={response.content}
          submitLabel={STRINGS.actions.save}
          submittingLabel={STRINGS.actions.saving}
          onSubmit={async (content) => {
            await onUpdateResponse(review.id, content);
            setMode('view');
          }}
          onCancel={() => setMode('view')}
        />
      </div>
    );
  }

  // Botón "Responder" cuando el admin aún no ha respondido.
  if (!response) {
    return (
      <Button
        type="button"
        onClick={() => setMode('create')}
        className="!bg-transparent !text-primary border border-primary/40 hover:!bg-primary/10 sm:w-auto sm:px-4 text-sm"
      >
        {STRINGS.actions.respond}
      </Button>
    );
  }

  // Vista de la respuesta + controles de admin.
  return (
    <div className={containerClass}>
      <ResponseDisplay response={response} />

      {isAdmin && (
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className="text-xs font-medium text-primary hover:underline"
          >
            {STRINGS.actions.edit}
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="text-xs font-medium text-destructive hover:underline"
          >
            {STRINGS.actions.delete}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={STRINGS.deleteConfirm.title}
        message={STRINGS.deleteConfirm.message}
        confirmLabel={STRINGS.deleteConfirm.confirm}
        cancelLabel={STRINGS.deleteConfirm.cancel}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
        destructive
      />
    </div>
  );
}
