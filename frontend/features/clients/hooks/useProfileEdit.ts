'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { extractErrorMessage } from '@/lib/http/extractErrorMessage';
import { UpdateProfileData, UpdateProfileResponse } from '../types/profile.interface';
import { CLIENT_API, PROFILE_ERROR_MESSAGES } from '../constants/clients.constants';

export function useProfileEdit() {
  const { login, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiFetch<UpdateProfileResponse>(CLIENT_API.me, {
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
        setError(extractErrorMessage(err.body, PROFILE_ERROR_MESSAGES.updateProfile));
      } else {
        setError(err instanceof Error ? err.message : PROFILE_ERROR_MESSAGES.unknown);
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
