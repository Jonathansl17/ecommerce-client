'use client';

import { type ReactNode, useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  destructive?: boolean;
  // Deshabilita el botón de confirmar (p. ej. hasta que se complete un campo requerido).
  confirmDisabled?: boolean;
  // Muestra una "X" de cierre en la cabecera (equivalente a Cancelar).
  showClose?: boolean;
  // Contenido extra entre el mensaje y los botones (p. ej. un campo de motivo).
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
  destructive = false,
  confirmDisabled = false,
  showClose = false,
  children,
}: ConfirmDialogProps) {
  const titleId = useId();
  const messageId = useId();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  // Enfoca el botón cancelar SOLO al abrir el diálogo. Se separa del listener de
  // Escape a propósito: si dependiera de onCancel (que el padre suele recrear en cada
  // render), volvería a robar el foco con cada tecla escrita en un campo interno.
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Escape cierra el diálogo (salvo mientras carga).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const confirmClass = destructive
    ? '!bg-destructive !text-white hover:!opacity-90'
    : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-foreground/10 bg-background p-6 shadow-lg space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-foreground">
            {title}
          </h2>
          {showClose && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              aria-label={cancelLabel}
              className="-mr-1 -mt-1 rounded-md p-1 text-foreground/50 transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
        <p id={messageId} className="text-sm text-foreground/80">
          {message}
        </p>
        {children}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full rounded-md border border-foreground/20 bg-transparent py-2 font-medium text-foreground transition-opacity hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-5"
          >
            {cancelLabel}
          </button>
          <Button
            type="button"
            onClick={onConfirm}
            isLoading={loading}
            disabled={confirmDisabled}
            className={`sm:w-auto sm:px-5 ${confirmClass}`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
