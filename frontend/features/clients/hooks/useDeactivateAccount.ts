'use client';
import { DeactivateAccountData } from '../types/profile.interface';

import { useState } from 'react';
import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { extractErrorMessage } from '@/lib/http/extractErrorMessage';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { CLIENT_API, PROFILE_ERROR_MESSAGES } from '../constants/clients.constants';

export function useDeactivateAccount() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deactivateAccount = async (data: DeactivateAccountData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await apiFetch(CLIENT_API.me, {
        method: 'DELETE',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(10_000),
      });

      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(extractErrorMessage(err.body, PROFILE_ERROR_MESSAGES.deactivate));
      } else {
        setError(err instanceof Error ? err.message : PROFILE_ERROR_MESSAGES.unknown);
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
