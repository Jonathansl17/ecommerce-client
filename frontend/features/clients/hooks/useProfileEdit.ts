'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';

interface UpdateProfileData {
  fullName?: string;
  email?: string;
  password: string;
}

interface UpdateProfileResponse {
  message: string;
  cliente: {
    id: string;
    fullName: string;
    email: string;
  };
}

function extractErrorMessage(body: Record<string, unknown>, fallback: string): string {
  if (body.errors && Array.isArray(body.errors)) {
    const first = (body.errors as { message?: string }[])[0];
    return first?.message ?? fallback;
  }
  return (body.error as string) || fallback;
}

export function useProfileEdit() {
  const { token, login, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/clients/me`,
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
        throw new Error(extractErrorMessage(body, 'Error al actualizar perfil'));
      }

      const result = body as UpdateProfileResponse;

      if (user) {
        login(token!, {
          ...user,
          fullName: result.cliente.fullName,
          email: result.cliente.email,
        });
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
    updateProfile,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
