'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';

interface DeactivateAccountData {
  password: string;
}

function extractErrorMessage(body: Record<string, unknown>, fallback: string): string {
  if (body.errors && Array.isArray(body.errors)) {
    const first = (body.errors as { message?: string }[])[0];
    return first?.message ?? fallback;
  }
  return (body.error as string) || fallback;
}

export function useDeactivateAccount() {
  const { token, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deactivateAccount = async (data: DeactivateAccountData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/clients/me`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(10_000),
        },
      );

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(extractErrorMessage(body, 'Error al desactivar la cuenta'));
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
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
