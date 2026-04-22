'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface PasswordChangeResponse {
  message: string;
  confirmationLink?: string;
}

function extractErrorMessage(body: Record<string, unknown>, fallback: string): string {
  if (body.errors && Array.isArray(body.errors)) {
    const first = (body.errors as { message?: string }[])[0];
    return first?.message ?? fallback;
  }
  return (body.error as string) || fallback;
}

export function usePasswordChange() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationLink, setConfirmationLink] = useState<string | null>(null);

  const changePassword = async (data: ChangePasswordData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setConfirmationLink(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/clients/me/password`,
        {
          method: 'PUT',
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
        throw new Error(extractErrorMessage(body, 'Error al cambiar contraseña'));
      }

      const result = body as PasswordChangeResponse;

      if (result.confirmationLink) {
        setConfirmationLink(result.confirmationLink);
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
    changePassword,
    isLoading,
    error,
    confirmationLink,
    clearError: () => setError(null),
    clearConfirmationLink: () => setConfirmationLink(null),
  };
}
