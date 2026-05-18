'use client';

import { useState } from 'react';
import { useCancelOrder } from '../hooks/useCancelOrder';
import { ORDERS_STRINGS, PENDING_PAYMENT_STATUS } from '../constants/orders.constants';

export interface CancelOrderButtonProps {
  orderId: string;
  currentStatus: string;
  onCancelled: () => void;
}

export function CancelOrderButton({
  orderId,
  currentStatus,
  onCancelled,
}: CancelOrderButtonProps) {
  const { cancelando, error, cancelar } = useCancelOrder();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (currentStatus !== PENDING_PAYMENT_STATUS) {
    return null;
  }

  function handleOpenConfirm() {
    setConfirmOpen(true);
  }

  function handleCloseConfirm() {
    setConfirmOpen(false);
  }

  async function handleConfirm() {
    const success = await cancelar(orderId);
    if (success) {
      setConfirmOpen(false);
      onCancelled();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpenConfirm}
        className="inline-flex items-center rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
      >
        {ORDERS_STRINGS.cancelButton}
      </button>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-order-dialog-title"
          aria-describedby="cancel-order-dialog-description"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2
              id="cancel-order-dialog-title"
              className="text-lg font-bold text-slate-950"
            >
              {ORDERS_STRINGS.confirmTitle}
            </h2>
            <p
              id="cancel-order-dialog-description"
              className="mt-2 text-sm text-slate-600"
            >
              {ORDERS_STRINGS.confirmDescription}
            </p>

            {error != null && (
              <p
                role="alert"
                className="mt-3 text-sm font-medium text-red-600"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseConfirm}
                disabled={cancelando}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ORDERS_STRINGS.confirmCancel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={cancelando}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelando ? '...' : ORDERS_STRINGS.confirmAccept}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
