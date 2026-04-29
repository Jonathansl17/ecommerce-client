'use client';

import { useDownloadPaymentReceipt } from '../../hooks/useDownloadPaymentReceipt';
import { PAYMENT_RECEIPT_STRINGS } from '../../constants/notifications.constants';
import type { DownloadReceiptLinkProps } from '../../types/notifications.types';

export function DownloadReceiptLink({ paymentId }: DownloadReceiptLinkProps) {
  const { descargar, descargando, error } = useDownloadPaymentReceipt(paymentId);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          descargar();
        }}
        disabled={descargando}
        className="inline-flex items-center gap-1 rounded text-xs font-medium text-emerald-700 transition-colors hover:underline hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-400"
      >
        {descargando
          ? PAYMENT_RECEIPT_STRINGS.downloadingLabel
          : PAYMENT_RECEIPT_STRINGS.downloadLabel}
      </button>
      {error != null && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
