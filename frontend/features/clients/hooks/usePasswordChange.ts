'use client';

import { useState } from 'react';
import { apiFetch, ApiError } from '@/lib/http/apiFetch';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface PasswordChangeResponse {
  message: string;
  confirmationLink?: string;
}

function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    if (Array.isArray(record.errors)) {
      const first = (record.errors as { message?: string }[])[0];
      if (first?.message) return first.message;
    }
    if (typeof record.error === 'string') return record.error;
  }
  return fallback;
}

export function usePasswordChange() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationLink, setConfirmationLink] = useState<string | null>(null);

  const changePassword = async (data: ChangePasswordData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setConfirmationLink(null);

    try {
      const result = await apiFetch<PasswordChangeResponse>('/clients/me/password', {
        method: 'PUT',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(10_000),
      });

      if (result.confirmationLink) {
        setConfirmationLink(result.confirmationLink);
      }

      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(extractErrorMessage(err.body, 'Error al cambiar contraseña'));
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
    error,
    confirmationLink,
    clearError: () => setError(null),
    clearConfirmationLink: () => setConfirmationLink(null),
  };
}
