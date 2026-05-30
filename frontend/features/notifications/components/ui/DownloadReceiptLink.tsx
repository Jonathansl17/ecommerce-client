'use client';

import { Download } from 'lucide-react';
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
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {descargando
          ? PAYMENT_RECEIPT_STRINGS.downloadingLabel
          : PAYMENT_RECEIPT_STRINGS.downloadLabel}
        <Download className="h-3 w-3 opacity-50" />
      </button>
      {error != null && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
