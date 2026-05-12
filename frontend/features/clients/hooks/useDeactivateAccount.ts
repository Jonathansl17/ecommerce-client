'use client';

import { useState } from 'react';
import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { useAuth } from '@/features/auth/hooks/AuthContext';

interface DeactivateAccountData {
  password: string;
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

export function useDeactivateAccount() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deactivateAccount = async (data: DeactivateAccountData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await apiFetch('/clients/me', {
        method: 'DELETE',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(10_000),
      });

      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(extractErrorMessage(err.body, 'Error al desactivar la cuenta'));
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deactivateAccount,
    logout,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
