'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { apiFetch, ApiError } from '@/lib/http/apiFetch';

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

export function useProfileEdit() {
  const { login, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiFetch<UpdateProfileResponse>('/clients/me', {
        method: 'PUT',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(10_000),
      });

      if (user) {
        login({
          ...user,
          fullName: result.cliente.fullName,
          email: result.cliente.email,
        });
      }

      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(extractErrorMessage(err.body, 'Error al actualizar perfil'));
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
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
