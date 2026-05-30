'use client';

import { useCallback, useState } from 'react';
import { fetchPaymentReceiptBlob } from '../api/notifications.api';
import { PAYMENT_RECEIPT_STRINGS } from '../constants/notifications.constants';
import type { UseDownloadPaymentReceiptResult } from '../types/notifications.types';

export function useDownloadPaymentReceipt(
  paymentId: string,
): UseDownloadPaymentReceiptResult {
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const descargar = useCallback(async () => {
    if (descargando) return;

    setDescargando(true);
    setError(null);

    try {
      const blob = await fetchPaymentReceiptBlob(paymentId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = PAYMENT_RECEIPT_STRINGS.filename(paymentId);
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch {
      setError(PAYMENT_RECEIPT_STRINGS.downloadError);
    } finally {
      setDescargando(false);
    }
  }, [paymentId, descargando]);

  return { descargar, descargando, error };
}
